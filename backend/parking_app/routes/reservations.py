from fastapi import Depends
from fastapi.responses import PlainTextResponse

from parking_app.schema.requests import ReservationRequest
from parking_app.db import get_db
from .api_router import router

@router.post("/reservations", tags=["reservations"])
async def create_reservation(rq: ReservationRequest, db= Depends(get_db)):
    return PlainTextResponse("Reservation created", status_code=200)

@router.get("/reservations/", tags=["reservations"])
async def get_my_reservations(db=Depends(get_db)):
    return PlainTextResponse("My reservations", status_code=200)