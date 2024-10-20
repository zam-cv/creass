from fastapi import FastAPI
from routes import receive

app = FastAPI()
app.include_router(receive.receive_router, prefix="/api", tags=["receive"])