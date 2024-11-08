from fastapi import Depends
from fastapi.responses import PlainTextResponse

from parking_app.schema.requests import UserRegistrationRequest, UserUpdateRequest
from parking_app.db import get_db
from .api_router import router
 
@router.post("/users", tags=["users"])
async def register_user(rq: UserRegistrationRequest, db=Depends(get_db)):
    return PlainTextResponse("User registered", status_code=200)

@router.delete("/users/{user_id}", tags=["users"])
async def delete_user(db=Depends(get_db)):
    return PlainTextResponse("User deleted", status_code=200)

@router.put("/users/{user_id}", tags=["users"])
async def update_user(rq: UserUpdateRequest, db=Depends(get_db)):
    return PlainTextResponse("User updated", status_code=200)