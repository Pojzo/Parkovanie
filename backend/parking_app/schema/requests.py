from datetime import datetime
from pydantic import BaseModel, Field

class UserRegistrationRequest(BaseModel):
    name: str = Field(..., description="User's name")
    email: str = Field(..., description="User's email")
    license_plate: str = Field(..., description="User's license plate")
    password: str = Field(..., description="User's password")

class UserUpdateRequest(BaseModel):
    name: str = Field(None, description="User's name")
    email: str = Field(None, description="User's email")
    license_plate: str = Field(None, description="User's license plate")
    password: str = Field(None, description="User's password")

class ReservationRequest(BaseModel):
    spot_id: int = Field(..., description="ID of the parking spot")
    start_time: datetime = Field(..., description="Start time of the reservation")
    end_time: datetime = Field(..., description="End time of the reservation")