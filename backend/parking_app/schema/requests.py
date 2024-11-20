from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, model_validator, root_validator

from parking_app.config import MAX_RESERAVATION_TIME_HOURS


class ReservationRequest(BaseModel):
    spot_id: int = Field(..., title="Parking spot ID")
    license_plate: str = Field(..., title="License plate")
    email: str = Field(..., title="Email")
    start_time: datetime = Field(..., title="Start time")
    end_time: datetime = Field(..., title="End time")


class CreateGarageRequest(BaseModel):
    name: str = Field(..., description="Name of the garage")
    location: str = Field(..., description="Location of the garage")
    floors: int = Field(..., description="Number of floors")
    num_rows: int = Field(..., description="Number of rows")
    num_cols: int = Field(..., description="Number of columns")


class UpdateGarageRequest(BaseModel):
    name: Optional[str] = Field(None, description="Name of the garage")
    location: Optional[str] = Field(None, description="Location of the garage")


class CreateSpotRequest(BaseModel):
    floor_number: int = Field(..., title="Floor number")
    spot_row: int = Field(..., title="Row number")
    spot_col: int = Field(..., title="Column number")
    is_reserved: Optional[bool]= Field(False, title="Whether the spot is reserved")


class UpdateSpotRequest(BaseModel): ...
