import uuid
import os
import logging
from logging.handlers import RotatingFileHandler
from typing import List

from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware # Ensure this import is here
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import get_db, engine

# --- Logging Configuration ---
LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = RotatingFileHandler("logs/app.log", maxBytes=1000000, backupCount=5)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
if not logger.handlers:
    logger.addHandler(handler)
    consoleHandler = logging.StreamHandler()
    consoleHandler.setFormatter(formatter)
    logger.addHandler(consoleHandler)

# --- Database Table Creation ---
models.Base.metadata.create_all(bind=engine)

# --- FastAPI App Instance ---
app = FastAPI(
    title="OptiExtract File Uploader",
    description="An API for uploading files and tracking their metadata.",
    version="1.0.0"
)

# --- THIS IS THE CRUCIAL CORS MIDDLEWARE BLOCK ---
origins = [
    "http://localhost:5173",  # Vite's default dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- END OF CORS BLOCK ---

UPLOAD_DIRECTORY = "./uploaded_files"

@app.get("/")
def read_root():
    return {"status": "ok"}

@app.post("/upload-document/", response_model=schemas.FileMetadata)
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_extension = os.path.splitext(file.filename)[1]
    system_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIRECTORY, system_filename)
    
    try:
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
        logger.info(f"Successfully saved file: {system_filename} from original: {file.filename}")
    except Exception as e:
        logger.error(f"Error uploading file {file.filename}: {e}")
        raise HTTPException(status_code=500, detail="There was an error uploading the file.")
    
    file_size = len(contents)
    file_meta_to_create = schemas.FileMetadataCreate(
        original_filename=file.filename,
        system_filename=system_filename,
        file_size_bytes=file_size
    )
    new_file_meta = crud.create_file_metadata(db=db, file_meta=file_meta_to_create)
    logger.info(f"Successfully created metadata for file ID: {new_file_meta.id}")
    return new_file_meta

@app.get("/files/", response_model=List[schemas.FileMetadata])
def read_files(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logger.info("Request received for /files/ endpoint")
    try:
        files = crud.get_all_file_metadata(db, skip=skip, limit=limit)
        logger.info(f"Returning {len(files)} file metadata records.")
        return files
    except Exception as e:
        logger.error(f"Error retrieving files from database: {e}")
        raise HTTPException(status_code=500, detail="Could not retrieve file records.")