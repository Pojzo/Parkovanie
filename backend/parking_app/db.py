from parking_app.config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
import aiomysql

async def create_connection() -> aiomysql.Connection:
    return await aiomysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        db=DB_NAME
    )

async def get_db():
    connection = await create_connection()
    try:
        yield connection
    finally:
        connection.close()
