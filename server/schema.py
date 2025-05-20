from pydantic import BaseModel
from datetime import date


class FoodIn(BaseModel):
    name: str
    expiration_date: date
    category: str


class FoodOut(FoodIn):
    id: int


class FoodUpdate(BaseModel):
    name: str | None = None
    expiration_date: date | None = None
    category: str | None = None
