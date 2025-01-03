from datetime import datetime, timedelta
from aiomysql import Connection
import aiomysql
from fastapi.responses import JSONResponse
from parking_app.models.models import GarageModel, SpotModel
from parking_app.schema.requests import CreateSpotRequest, ReserveSpotRequest
from parking_app.schema.responses import SuccessResponse


async def _get_spot_by_id(
    garage_id: int, spot_id: int, db: Connection
) -> SpotModel | None:
    async with db.cursor(aiomysql.DictCursor) as cursor:
        await cursor.execute(
            "SELECT * FROM ParkingSpot WHERE garage_id = %s AND spot_id = %s",
            (garage_id, spot_id),
        )

        if cursor.rowcount == 0:
            return None

        spot_raw = await cursor.fetchone()
        if spot_raw is None:
            return None

        return SpotModel(**spot_raw)


# Returns true if a spot exists in a given garage, false otherwise
async def _spot_exists(
    garage_id: int, row: int, col: int, db: Connection
) -> bool:
    async with db.cursor() as cursor:
        await cursor.execute(
            "SELECT * FROM ParkingSpot WHERE garage_id = %s AND spot_row = %s AND spot_col = %s",
            (garage_id, row, col),
        )

        return cursor.rowcount > 0

# Returns all spots in a given garage
async def _get_all_spots_in_garage(garage_id: int, db: Connection) -> list[SpotModel]:
    async with db.cursor(aiomysql.DictCursor) as cursor:
        await cursor.execute(
            "SELECT * FROM ParkingSpot WHERE garage_id = %s",
            (garage_id,),
        )

        all_spots = await cursor.fetchall()

        return [SpotModel(**spot) for spot in all_spots]

# Creates a new spot for a given garage, throws an error if the spot already exists
# Returns the newly created spot as a SpotModel
async def _create_garage_spot(
    garage_id: int, spot: CreateSpotRequest, db: Connection
) -> SpotModel:
    async with db.cursor(aiomysql.DictCursor) as cursor:
        await cursor.execute(
            "INSERT INTO ParkingSpot (garage_id, spot_row, spot_col, floor_number) VALUES (%s, %s, %s, %s)",
            (garage_id, spot.spot_row, spot.spot_col, spot.floor_number),
        )
        if cursor.rowcount == 0:
            raise Exception("Failed to create spot")

        last_spot_id = cursor.lastrowid

        spot = await _get_spot_by_id(garage_id, last_spot_id, db)

        if spot is None:
            raise Exception("Failed to retrieve created spot")

        return spot
    
async def _delete_all_spots_in_garage(garage_id: int, db: Connection):
    async with db.cursor() as cursor:
        await cursor.execute(
            "DELETE FROM ParkingSpot WHERE garage_id = %s",
            (garage_id,)
        )
        await db.commit()

async def _spot_reserved(garage_id: int, spot_id: int, db: Connection) -> bool:
    async with db.cursor() as cursor:
        await cursor.execute(
            "SELECT lease_till FROM ParkingSpot WHERE garage_id = %s AND spot_id = %s",
            (garage_id, spot_id),
        )

        row = await cursor.fetchone()
        lease_till = row[0]

        if lease_till is None:
            return False
        
        if lease_till > datetime.now():
            return True

async def _reserve_spot(garage_id: int, spot_id: int, lease_duration_hours: int, db: Connection):
    async with db.cursor() as cursor:
        await cursor.execute(
            """UPDATE ParkingSpot 
            SET lease_till = %s
            WHERE garage_id = %s AND spot_id = %s""",

            (datetime.now() + timedelta(hours=lease_duration_hours), garage_id, spot_id),
        )
        await db.commit()

async def _store_reservation(garage_id: int, spot_id: int, client_identifier: str, db: Connection):
    async with db.cursor() as cursor:
        await cursor.execute(
            "INSERT INTO  Reservation (garage_id, spot_id, client_identifier) VALUES (%s, %s, %s)",
            (garage_id, spot_id, client_identifier),
        )
        await db.commit()

# Controller for the POST /garages/{garage_id}/spots endpoint
async def handle_create_garage_spots(
    garage_id: int, rq: list[CreateSpotRequest], delete_existing: bool, db: Connection
) -> SuccessResponse[list[SpotModel]]:
    if delete_existing:
        print("Deleting existing spots")
        await _delete_all_spots_in_garage(garage_id, db)

    new_spots = []
    # For every spot, check if it already exists
    for spot in rq:
        # If the spot is already occupied, don't create any spots and return an error
        if await _spot_exists(garage_id, spot.spot_row, spot.spot_col, db):
            return JSONResponse(
                status_code=409,
                content={"status": "error", "message": "Spot already exists"},
            )

    # If not, we can create all the spots
    for spot in rq:
        try:
            new_spot = await _create_garage_spot(garage_id, spot, db)

        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": "Failed to create spot"},
            )

        new_spots.append(new_spot)

    await db.commit()
   
    return SuccessResponse[list[SpotModel]](data=new_spots)

async def handle_get_garage_spots(garage_id: int, db: Connection):
    all_spots = await _get_all_spots_in_garage(garage_id, db)
   
    return SuccessResponse[list[SpotModel]](data=all_spots)

async def handle_reserve_spot(rq: ReserveSpotRequest, db: Connection):
    if await _spot_reserved(rq.garage_id, rq.spot_id, db):
        return JSONResponse(
            status_code=409,
            content={"status": "error", "message": "Spot already reserved"},
        )

    await _reserve_spot(rq.garage_id, rq.spot_id, rq.lease_duration_hours, db)
    await _store_reservation(rq.garage_id, rq.spot_id, rq.client_identifier, db)

    return JSONResponse(
        status_code=200,
        content={"status": "success", "message": "Spot reserved"},
    )