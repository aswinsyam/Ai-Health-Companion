import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # DATABASE_URL = os.getenv("DATABASE_URL")  # Commented out
    SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_jwt_key_12345")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

settings = Settings()