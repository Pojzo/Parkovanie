from aiomysql import Connection
from fastapi import APIRouter, Depends, HTTPException, Path, Query
from fastapi.responses import JSONResponse

from parking_app.controllers.common import get_garage_by_id
from parking_app.exceptions import CustomHTTPException
from parking_app.controllers.garages import handle_create_garage, handle_delete_garage, handle_get_all_garages
from parking_app.models.models import GarageModel
from parking_app.schema.responses import ErrorResponse, SuccessResponse
from parking_app.db import get_db
from parking_app.schema.requests import CreateGarageRequest, ReservationRequest, UpdateGarageRequest

router = APIRouter()


async def get_garage_by_id_or_raise(garage_id: int, db: Connection) -> GarageModel:
    garage = await get_garage_by_id(garage_id, db)

    if garage is None:
        raise CustomHTTPException(status_code=404, status="error", message=f"Garage with id {garage_id} not found")
    
    return garage
    
@router.post("/reservations", tags=["reservations"])
async def create_reservation(rq: ReservationRequest, db: Connection = Depends(get_db)):
    return JSONResponse(status_code=200, content={"status": "success", "message": "Reservation created"})


@router.get("/garages", tags=["garages"])
async def get_garages(db: Connection = Depends(get_db)):
    return await handle_get_all_garages(db)


@router.get("/garages/{garage_id}/spots", tags=["spots"])
async def get_garage_spots(garage_id: int, db: Connection = Depends(get_db)):
    return JSONResponse(
        status_code=200, content={"status": "success", "message": f"Garage {garage_id} spots retrieved"}
    )

@router.get("/garages/{garage_id}", tags=["garages"])
async def get_garage(garage_id: int = Path(..., title="Garage ID"), db: Connection = Depends(get_db)):
    garage = await get_garage_by_id_or_raise(garage_id, db)
    return SuccessResponse[GarageModel](data=garage)

@router.post("/garages", tags=["garages"], response_model=SuccessResponse[GarageModel] | ErrorResponse)
async def create_garage(rq: CreateGarageRequest, db: Connection = Depends(get_db)):
    return await handle_create_garage(rq, db) 


@router.put("/garages/{garage_id}", tags=["garages"])
async def update_garage(garage_id: int, rq: UpdateGarageRequest, db: Connection = Depends(get_db)):
    garage = await get_garage_by_id_or_raise(garage_id, db)
    # return not implemented
    return JSONResponse(status_code=501, content={"status": "error", "message": "Not implemented"})


@router.delete("/garages/{garage_id}", tags=["garages"])
async def delete_garage(
    garage_id: int, db: Connection = Depends(get_db)
):
    garage = await get_garage_by_id_or_raise(garage_id, db)
    return await handle_delete_garage(garage, db)


@router.put("/garages/{garage_id}/spots/{spot_id}", tags=["spots"])
async def update_spot(garage_id: int, spot_id: int, db: Connection = Depends(get_db)):
    garage = await get_garage_by_id_or_raise(garage_id, db)
    return JSONResponse(status_code=501, content={"status": "error", "message": "Not implemented"})
