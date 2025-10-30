from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings # Import the settings instance

# Build the database URL from the settings object
DATABASE_URL = (
    f"postgresql://{settings.postgres_user}:{settings.postgres_password}@"
    f"{settings.postgres_server}/{settings.postgres_db}"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get a DB session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()