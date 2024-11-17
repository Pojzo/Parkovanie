from fastapi import HTTPException


class CustomHTTPException(HTTPException):
    def __init__(self, status_code: int, status: str, message: str):
        super().__init__(status_code)
        self.status= status
        self.message = message

