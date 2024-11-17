from typing import Generic, Literal, Optional, TypeVar, Union
from pydantic import BaseModel, Field


# Create generic success response

DataT = TypeVar("DataT")


class SuccessResponse(BaseModel, Generic[DataT]):
    status: Literal["success"] = "success"
    message: Optional[str] = None
    data: Optional[DataT] = None


class ErrorResponse(BaseModel):
    status: Literal["error"] = "error"
    status_code: int
    message: str
