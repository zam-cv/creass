from fastapi import FastAPI
from routes import load_class_img
import uvicorn
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI() 
app.include_router(load_class_img.app)   



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello fast"}


