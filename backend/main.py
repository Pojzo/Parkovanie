from fastapi import FastAPI

app = FastAPI(
    title="Parking API",
    description="A simple API for a parking system",
    version="0.1.0",
    contact={
        "Author 1": "Peter Kovac",
        "Author 2": "Lukas Gulik"
    }
)

@app.get("/")
def read_root():
    return "Hello World"