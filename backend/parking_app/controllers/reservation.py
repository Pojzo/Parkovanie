from aiomysql import Connection
from fastapi.responses import JSONResponse
from parking_app.controllers.common import get_garage_by_id, get_spots_in_garage
from parking_app.schema.requests import ReservationRequest


async def handle_create_reservation(rq: ReservationRequest, db: Connection):
    garage = await get_garage_by_id(rq.garage_id, db)
    if garage is None:
        return JSONResponse(
            status_code=404,
            content={"status": "error", "message": "Garage not found"},
        )

    spots = await get_spots_in_garage(rq.garage_id, db)
