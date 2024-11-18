from aiomysql import Connection
import aiomysql

from parking_app.models.models import GarageModel, SpotModel


# Retrieve a garage by id
async def get_garage_by_id(
    garage_id: int, db: Connection
) -> GarageModel | None:
    async with db.cursor(aiomysql.DictCursor) as cur:
        await cur.execute(
            "SELECT * FROM ParkingGarage WHERE garage_id = %s", (garage_id,)
        )
        if cur.rowcount == 0:
            return None

        garage_raw = await cur.fetchone()
        if garage_raw is None:
            return None

        return GarageModel(**garage_raw)


async def get_spots_in_garage(
    garage_id: int, db: Connection
) -> list[SpotModel]:
    async with db.cursor(aiomysql.DictCursor) as cursor:
        await cursor.execute(
            "SELECT * FROM ParkingSpot WHERE garage_id = %s", (garage_id,)
        )

        all_spots = await cursor.fetchall()

        return [SpotModel(**spot) for spot in all_spots]
