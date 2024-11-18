from typing import Optional
from pydantic import BaseModel, Field


class GarageModel(BaseModel):
    garage_id: Optional[int] = Field(None, description="ID of the garage")
    name: str = Field(..., description="Name of the garage")
    location: str = Field(..., description="Location of the garage")
    floors: int = Field(..., description="Number of floors in the garage")


class SpotModel(BaseModel):
    spot_id: int = Field(None, description="ID of the parking spot")
    garage_id: int = Field(..., description="ID of the garage")
    floor_number: int = Field(..., description="Floor number of the spot")
    spot_row: int = Field(..., description="Row number of the spot")
    spot_col: int = Field(..., description="Column number of the spot")
    is_reserved: bool = Field(False, description="Whether the spot is reserved")


class ReservationModel(BaseModel):
    id: int = Field(None, description="ID of the reservation")
    user_id: int = Field(..., description="ID of the user")
    spot_id: int = Field(..., description="ID of the parking spot")
    license_plate: str = Field(..., description="License plate of the vehicle")
    start_time: str = Field(..., description="Start time of the reservation")
    end_time: str = Field(..., description="End time of the reservation")
    confirmation_sent: bool = Field(
        False, description="Whether confirmation has been sent"
    )


class UserModel(BaseModel):
    id: int = Field(None, description="ID of the user")
    name: str = Field(..., description="Name of the user")
    email: str = Field(..., description="Email of the user")
    license_plate: str = Field(..., description="License plate of the user")
    password: str = Field(..., description="Password of the user")
