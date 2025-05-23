from pydantic import BaseModel
from datetime import date


class FoodIn(BaseModel):
    name: str
    expiration_date: date
    category_id: int


class FoodOut(FoodIn):
    id: int


class FoodUpdate(BaseModel):
    name: str | None = None
    expiration_date: date | None = None
    category_id: int | None = None
