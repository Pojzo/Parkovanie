import aiomysql
from fastapi import Depends, FastAPI
from fastapi.responses import JSONResponse, PlainTextResponse
from parking_app.exceptions import CustomHTTPException
from parking_app.config import version

from parking_app.db import get_db
from parking_app.routes import api_router

app = FastAPI(
    title="Parking API",
    description="A simple API for a parking system",
    version=version,
    contact={"Author 1": "Peter Kovac", "Author 2": "Lukas Gulik"},
)

@app.exception_handler(CustomHTTPException)
async def custom_exception_handler(request, exc):
    return JSONResponse(status_code=404, content={"status": exc.status, "message": exc.message})

app.include_router(api_router.router)


@app.get("/", tags=["meta"])
def read_root():
    return PlainTextResponse(f"A simple API for a parking system\nVersion: {version}")


@app.get("/health", tags=["meta"])
async def health(db: aiomysql.Connection = Depends(get_db)):
    try:
        async with db.cursor() as cursor:
            await cursor.execute("SELECT 1")

        return PlainTextResponse("OK", status_code=200)

    except Exception as e:
        return PlainTextResponse(str(e), status_code=500)
