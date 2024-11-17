from aiomysql import Connection
from fastapi import Depends
from backend.parking_app.models.models import GarageModel
from backend.parking_app.schema.requests import CreateGarageRequest

async def get_garage_by_id(garage_id: int, db: Connection):
    async with db.cursor() as cur:
        await cur.execute("SELECT * FROM garages WHERE id = %s", (garage_id,))
        return await cur.fetchone()

# Create a new garage
# Returns the created garage as pydantic GarageModel model
async def _create_garage(name: str, location: str, floors: int, db: Connection) -> GarageModel:
    async with db.cursor() as cursor:
        await cursor.execute(
            "INSERT INTO garages (name, location, floors) VALUES (%s, %s, %s) RETURNING garage_id, name, location, floors",
            (name, location, floors),
        )
        if cursor.rowcount == 0:
            raise Exception("Failed to create garage")
        
        garage_raw = await cursor.fetchone()
        await db.commit()

        garage_obj = GarageModel(**garage_raw)

        return garage_obj


async def handle_create_garage(rq: CreateGarageRequest, db: Connection):
    garage_id = await _create_garage(rq.name, rq.location, rq.floors, db) 