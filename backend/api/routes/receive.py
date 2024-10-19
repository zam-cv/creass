from fastapi import APIRouter
from schemas.data import Data

receive_router = APIRouter()

@receive_router.post("/receive", response_model=Data)
async def receive(data: Data):
    return data