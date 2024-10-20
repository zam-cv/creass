from pydantic import BaseModel

class DataBase(BaseModel):
    context: str
    prompt: str

class DataCreate(DataBase):
    pass

class Data(DataBase):   
    pass