from typing import Union
from aiomysql import Connection
from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query
from fastapi.responses import JSONResponse

from parking_app.schema.requests import ReserveSpotRequest
from parking_app.controllers.common import get_garage_by_id
from parking_app.controllers.spots import handle_create_garage_spots, handle_get_garage_spots, handle_reserve_spot
from parking_app.exceptions import CustomHTTPException
from parking_app.controllers.garage import (
    handle_create_garage,
    handle_delete_garage,
    handle_get_all_garages,
    handle_update_garage,
)
from parking_app.models.models import GarageModel, SpotModel
from parking_app.schema.responses import ErrorResponse, SuccessResponse
from parking_app.db import get_db
from parking_app.schema.requests import (
    CreateGarageRequest,
    CreateSpotRequest,
    ReservationRequest,
    UpdateGarageRequest,
)

router = APIRouter()


async def get_garage_by_id_or_raise(
    garage_id: int, db: Connection
) -> GarageModel:
    garage = await get_garage_by_id(garage_id, db)

    if garage is None:
        raise CustomHTTPException(
            status_code=404,
            status="error",
            message=f"Garage with id {garage_id} not found",
        )

    return garage


@router.post("/reservations", tags=["reservations"])
async def create_reservation(
    rq: ReservationRequest, db: Connection = Depends(get_db)
):
    return JSONResponse(
        status_code=200,
        content={"status": "success", "message": "Reservation created"},
    )


@router.get("/garages", tags=["garages"])
async def get_garages(db: Connection = Depends(get_db)):
    return await handle_get_all_garages(db)


@router.post(
    "/garages",
    tags=["garages"],
    response_model=SuccessResponse[GarageModel] | ErrorResponse,
)
async def create_garage(
    rq: CreateGarageRequest, db: Connection = Depends(get_db)
):
    return await handle_create_garage(rq, db)


@router.get("/garages/{garage_id}", tags=["garages"])
async def get_garage(
    garage_id: int = Path(..., title="Garage ID"),
    db: Connection = Depends(get_db),
):
    garage = await get_garage_by_id_or_raise(garage_id, db)
    return SuccessResponse[GarageModel](data=garage)


@router.patch("/garages/{garage_id}", tags=["garages"])
async def update_garage(
    garage_id: int, rq: UpdateGarageRequest, db: Connection = Depends(get_db)
):
    garage = await get_garage_by_id_or_raise(garage_id, db)
    return await handle_update_garage(garage, rq, db)


@router.get("/garages/{garage_id}/spots", tags=["spots"], response_model=SuccessResponse[list[SpotModel]])
async def get_garage_spots(garage_id: int, db: Connection = Depends(get_db)):
    garage = await get_garage_by_id_or_raise(garage_id, db)
    return await handle_get_garage_spots(garage.garage_id, db)

@router.post(
    "/garages/{garage_id}/spots",
    tags=["spots"],
    response_model=SuccessResponse[list[SpotModel]] | ErrorResponse,
)
async def create_garage_spots(
    garage_id: int,
    rq: Union[list[CreateSpotRequest], CreateSpotRequest],
    delete_existing: bool = Query(False, title="Delete existing spots", description="Whether to delete existing spots in the garage"),
    db: Connection = Depends(get_db),
):
    await get_garage_by_id_or_raise(garage_id, db)

    # In case of a single spot creation request, convert it to a list
    if isinstance(rq, CreateSpotRequest):
        rq = [rq]

    return await handle_create_garage_spots(garage_id, rq, delete_existing, db)


@router.delete("/garages/{garage_id}", tags=["garages"])
async def delete_garage(garage_id: int, db: Connection = Depends(get_db)):
    garage = await get_garage_by_id_or_raise(garage_id, db)
    return await handle_delete_garage(garage, db)


@router.put("/garages/{garage_id}/spots/{spot_id}", tags=["spots"])
async def update_spot(
    garage_id: int, spot_id: int, db: Connection = Depends(get_db)
):
    garage = await get_garage_by_id_or_raise(garage_id, db)
    return JSONResponse(
        status_code=501,
        content={"status": "error", "message": "Not implemented"},
    )


@router.post("/reserve", tags=["reservations"])
async def reserver_spot(
    rq: ReserveSpotRequest, db: Connection = Depends(get_db)
):
    garage = await get_garage_by_id_or_raise(rq.garage_id, db)
    return await handle_reserve_spot(rq, db)