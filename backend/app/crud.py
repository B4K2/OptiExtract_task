from sqlalchemy.orm import Session
from . import models, schemas

def create_file_metadata(db: Session, file_meta: schemas.FileMetadataCreate):
    db_file_meta = models.FileMetadata(
        original_filename=file_meta.original_filename,
        system_filename=file_meta.system_filename,
        file_size_bytes=file_meta.file_size_bytes
    )
    db.add(db_file_meta)
    db.commit()
    db.refresh(db_file_meta)
    return db_file_meta

def get_all_file_metadata(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.FileMetadata).offset(skip).limit(limit).all()