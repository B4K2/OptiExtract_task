from pydantic import BaseModel
from datetime import datetime

class FileMetadataBase(BaseModel):
    original_filename: str
    system_filename: str
    file_size_bytes: int

class FileMetadataCreate(FileMetadataBase):
    pass

class FileMetadata(FileMetadataBase):
    id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True 