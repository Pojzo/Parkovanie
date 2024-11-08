import aiomysql
from fastapi import Depends, FastAPI
from fastapi.responses import PlainTextResponse

from parking_app.db import get_db
from parking_app.routes import api_router
from .routes import users, reservations

app = FastAPI(
    title="Parking API",
    description="A simple API for a parking system",
    version="0.1.0",
    contact={
        "Author 1": "Peter Kovac",
        "Author 2": "Lukas Gulik"
    }
)

app.include_router(api_router.router)

@app.get("/")
def read_root():
    return "Hello World"

@app.get("/health")
async def health(db: aiomysql.Connection=Depends(get_db)):
    try:
        async with db.cursor() as cursor:
            await cursor.execute("SELECT 1")
        
        return PlainTextResponse("OK", status_code=200)
    
    except Exception as e:
        return PlainTextResponse(str(e), status_code=500)
