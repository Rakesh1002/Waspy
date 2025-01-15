import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logger import setup_logging

app = FastAPI(
    title="WhatsApp Bot API",
    description="AI-powered WhatsApp Bot API using FastAPI",
    version="1.0.0",
)

# Setup logging
setup_logging()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router, prefix="/api/v1")


@app.on_event("startup")
async def startup_event() -> None:
    logger.info("Starting up WhatsApp Bot API")


@app.on_event("shutdown")
async def shutdown_event() -> None:
    logger.info("Shutting down WhatsApp Bot API")


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info",
    )
