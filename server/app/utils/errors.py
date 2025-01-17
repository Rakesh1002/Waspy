from fastapi import HTTPException

class WhatsAppError(HTTPException):
    def __init__(self, message: str, status_code: int = 500):
        super().__init__(status_code=status_code, detail=message) 