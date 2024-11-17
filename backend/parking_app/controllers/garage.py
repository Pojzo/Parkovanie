from aiomysql import Connection
import aiomysql
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from parking_app.controllers.common import get_garage_by_id
from parking_app.schema.responses import ErrorResponse, SuccessResponse
from parking_app.models.models import GarageModel
from parking_app.schema.requests import CreateGarageRequest, UpdateGarageRequest

# -------- BUSINESS LOGIC --------


# Retrieve a garage by name
async def _get_garage_by_name(name: str, db: Connection) -> GarageModel | None:
    async with db.cursor(aiomysql.DictCursor) as cur:
        await cur.execute("SELECT * FROM ParkingGarage WHERE name = %s", (name,))
        if cur.rowcount == 0:
            return None

        garage_raw = await cur.fetchone()
        if garage_raw is None:
            return None

        return GarageModel(**garage_raw)


# Retrieve all garages from the database
async def _get_all_garages(db):
    async with db.cursor(aiomysql.DictCursor) as cur:
        await cur.execute("SELECT * FROM ParkingGarage")
        garages_raw = await cur.fetchall()
        garages = [GarageModel(**garage) for garage in garages_raw]
        return garages


# Create a new garage
# Returns the created garage as pydantic GarageModel model
async def _create_garage(
    name: str, location: str, floors: int, db: Connection
) -> GarageModel:
    async with db.cursor() as cursor:
        await cursor.execute(
            "INSERT INTO ParkingGarage (name, location, floors) VALUES (%s, %s, %s)",
            (name, location, floors),
        )
        if cursor.rowcount == 0:
            raise Exception("Failed to create garage")

        garage_id = cursor.lastrowid

        await db.commit()

        garage = await get_garage_by_id(garage_id, db)
        if garage is None:
            raise Exception("Failed to retrieve created garage")

        return garage


async def _delete_garage(garage: GarageModel, db: Connection):
    async with db.cursor() as cursor:
        await cursor.execute(
            "DELETE FROM ParkingGarage WHERE garage_id = %s", (garage.garage_id,)
        )
        await db.commit()


async def _update_garage(garage_id: int, name: str, location: str, db: Connection):
    async with db.cursor() as cursor:
        await cursor.execute(
            "UPDATE ParkingGarage SET name = %s, location = %s WHERE garage_id = %s",
            (name, location, garage_id),
        )
        await db.commit()


# -------- CONTROLLERS --------


# Controller for the POST /garages endpoint
async def handle_create_garage(rq: CreateGarageRequest, db: Connection):
    if await _get_garage_by_name(rq.name, db) is not None:
        return JSONResponse(
            status_code=409,
            content={"status": "error", "message": "Garage with this name already exists"},
        )
              
    garage_id = await _create_garage(rq.name, rq.location, rq.floors, db)

    return SuccessResponse[GarageModel](data=garage_id)


# Controller for the GET /garages endpoint
async def handle_get_all_garages(db: Connection):
    all_garages = await _get_all_garages(db)
    return SuccessResponse[list[GarageModel]](
        data=all_garages, message="All garages retrieved"
    )


# Controller for the DELETE /garages/{garage_id} endpoint
async def handle_delete_garage(garage: GarageModel, db: Connection):
    await _delete_garage(garage, db)

    garage = await get_garage_by_id(garage.garage_id, db)

    if garage is not None:
        raise HTTPException(status_code=500, detail="Failed to delete garage")

    return SuccessResponse[None](message="Garage deleted")


# Controller for the PATCH /garages/{garage_id} endpoint
async def handle_update_garage(
    garage: GarageModel, rq: UpdateGarageRequest, db: Connection
):
    if rq.name is None and rq.location is None:
        raise HTTPException(status_code=422, detail="No fields to update")

    new_name = rq.name if rq.name is not None else garage.name
    new_location = rq.location if rq.location is not None else garage.location

    await _update_garage(garage.garage_id, new_name, new_location, db)

    new_garage = await _get_garage_by_name(new_name, db)

    return SuccessResponse[GarageModel](data=new_garage)
