from typing import Generic, Optional, TypeVar, Union
from pydantic import BaseModel, Field


# Create generic success response

DataT = TypeVar("DataT")

class SuccessResponse(BaseModel, Generic[DataT]):
    status: str = Field("success", const=True)
    message: Optional[str] = None
    data: Optional[DataT] = None

class ErrorResponse(BaseModel):
    status: str = Field("error", const=True)
    message: str