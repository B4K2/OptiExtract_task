from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # These variables will be loaded from the .env file
    postgres_user: str
    postgres_password: str
    postgres_server: str
    postgres_db: str

    class Config:
        env_file = ".env" # Specifies the file to load the variables from

# Create a single instance of the Settings class that can be imported elsewhere
settings = Settings()