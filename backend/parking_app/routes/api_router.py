from aiomysql import Connection
from fastapi import APIRouter, Depends, Path, Query
from fastapi.responses import JSONResponse

from parking_app.db import get_db
from parking_app.schema.requests import CreateGarageRequest, ReservationRequest, UpdateGarageRequest

router = APIRouter()


@router.post("/reservations", tags=["reservations"])
async def create_reservation(rq: ReservationRequest, db: Connection = Depends(get_db)):
    return JSONResponse(status_code=200, content={"status": "success", "message": "Reservation created"})


@router.get("/garages", tags=["garages"])
async def get_garages(db: Connection = Depends(get_db)):
    return JSONResponse(status_code=200, content={"status": "success", "message": "Garages retrieved"})


@router.get("/garages/{garage_id}/spots", tags=["spots"])
async def get_garage_spots(garage_id: int, db: Connection = Depends(get_db)):
    return JSONResponse(
        status_code=200, content={"status": "success", "message": f"Garage {garage_id} spots retrieved"}
    )


@router.post("/garages", tags=["garages"])
async def create_garage(rq: CreateGarageRequest, db: Connection = Depends(get_db)):
    return JSONResponse(status_code=200, content={"status": "success", "message": "Garage created"})


@router.put("/garages/{garage_id}", tags=["garages"])
async def update_garage(rq: UpdateGarageRequest, db: Connection = Depends(get_db)):
    return JSONResponse(status_code=200, content={"status": "success", "message": f"Garage updated"})


@router.delete("/garages/{garage_id}", tags=["garages"])
async def delete_garage(
    garage_id: int = Path(..., title="Garage ID", description="Garage ID to delete"), db: Connection = Depends(get_db)
):
    return JSONResponse(status_code=200, content={"status": "success", "message": f"Garage {garage_id} deleted"})


@router.put("/garages/{garage_id}/spots/{spot_id}", tags=["spots"])
async def update_spot(garage_id: int, spot_id: int, db: Connection = Depends(get_db)):
    return JSONResponse(status_code=200, content={"status": "success", "message": f"Spot {spot_id} updated"})
