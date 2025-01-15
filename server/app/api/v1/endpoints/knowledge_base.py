from typing import Any, Dict, List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from loguru import logger
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.services.knowledge_base_service import KnowledgeBaseService

router = APIRouter()
kb_service = KnowledgeBaseService()


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Dict = Depends(get_current_user),
) -> Dict[str, Any]:
    """Upload a file to the knowledge base."""
    try:
        # Read file content
        content = await file.read()

        # Process file
        await kb_service.process_file(content, file.filename, db)

        return {
            "success": True,
            "message": f"File {file.filename} processed successfully",
        }
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")


@router.post("/connect")
async def connect_database(
    connection_params: Dict[str, str],
    db: Session = Depends(get_db),
    current_user: Dict = Depends(get_current_user),
) -> Dict[str, Any]:
    """Connect to external database."""
    try:
        success = await kb_service.connect_database(connection_params)

        if not success:
            raise HTTPException(status_code=400, detail="Failed to connect to database")

        return {
            "success": True,
            "message": "Database connected and indexed successfully",
        }
    except Exception as e:
        logger.error(f"Error connecting to database: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to connect to database: {str(e)}"
        )


@router.get("/search")
async def search_knowledge_base(
    query: str,
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: Dict = Depends(get_current_user),
) -> List[Dict[str, Any]]:
    """Search the knowledge base for similar content."""
    try:
        results = await kb_service.search_similar(query, db, limit)
        return results
    except Exception as e:
        logger.error(f"Error searching knowledge base: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to search knowledge base: {str(e)}"
        )
