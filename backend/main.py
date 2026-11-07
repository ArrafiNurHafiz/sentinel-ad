import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

from app.core.config import settings
from app.api.forensics import router as forensics_router
from app.api.vault import router as vault_router
from app.api.personnel import router as personnel_router
from app.api.audit import router as audit_router
from app.api.settings import router as settings_router
from app.api.c2 import router as c2_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="2.0.0",
    description="Military-Grade Multimodal Deepfake Forensics & Tactical Chain-of-Custody Backend",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(forensics_router, prefix=settings.API_V1_STR)
app.include_router(vault_router, prefix=settings.API_V1_STR)
app.include_router(personnel_router, prefix=settings.API_V1_STR)
app.include_router(audit_router, prefix=settings.API_V1_STR)
app.include_router(settings_router, prefix=settings.API_V1_STR)
app.include_router(c2_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
async def health_check():
    """Tactical System Health Check"""
    return {
        "status": "success",
        "data": {
            "service": settings.PROJECT_NAME,
            "version": "2.0.0",
            "environment": settings.ENVIRONMENT,
            "tactical_status": "OPERATIONAL",
            "device": settings.AI_MODEL_DEVICE
        },
        "message": "SENTINEL-AD Defense Engine ready.",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
