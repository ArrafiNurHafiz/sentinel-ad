import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "SENTINEL-AD AI Forensics Engine"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]
    
    # Pinata IPFS
    PINATA_API_KEY: str = os.getenv("PINATA_API_KEY", "")
    PINATA_API_SECRET: str = os.getenv("PINATA_API_SECRET", "")
    PINATA_JWT: str = os.getenv("PINATA_JWT", "")
    PINATA_GATEWAY_URL: str = os.getenv("PINATA_GATEWAY_URL", "https://gateway.pinata.cloud/ipfs/")
    
    # AI Inference Settings
    AI_MODEL_DEVICE: str = os.getenv("AI_MODEL_DEVICE", "cpu")
    CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.85"))
    
    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")

settings = Settings()
