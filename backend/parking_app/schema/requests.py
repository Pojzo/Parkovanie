from datetime import datetime
from pydantic import BaseModel, Field, model_validator, root_validator

from parking_app.config import MAX_RESERAVATION_TIME_HOURS


class ReservationRequest(BaseModel):
    spot_id: int = Field(..., title="Parking spot ID")
    license_plate: str = Field(..., title="License plate")
    email: str = Field(..., title="Email")
    start_time: datetime = Field(..., title="Start time")
    end_time: datetime = Field(..., title="End time")

    # @root_validator
    # def check_time_difference(cls, values):
    #     start_time = values.get('start_time')
    #     end_time = values.get('end_time')
    #     if start_time and end_time:
    #         if end_time <= start_time:
    #             raise ValueError('End time must be greater than start time')
    #         if (end_time - start_time).total_seconds() > MAX_RESERAVATION_TIME_HOURS * 3600:
    #             raise ValueError('Reservation cannot be longer than 4 hours')
    #     return values


class CreateGarageRequest(BaseModel): ...


class UpdateGarageRequest(BaseModel): ...
