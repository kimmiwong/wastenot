
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schema import FoodIn, FoodOut, FoodUpdate, NotificationOut
import db
from recipes import fetch_recipes


app = FastAPI()

origins = ["http://localhost:5173", "dpg-d108v4e3jp1c739o6pp0-a", "https://wastenot-frontend-e09l.onrender.com", "https://www.wastenotkitchen.com", "https://wastenotkitchen.com"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/food-items", response_model=list[FoodOut])
async def get_food_items() -> list[FoodOut]:
    return db.get_food_items()


@app.post("/api/food-items", response_model=FoodOut)
async def create_food_item(item: FoodIn) -> FoodOut:
    item = db.create_food_item(item)
    return item


@app.get("/api/food-items/{id}", response_model=FoodOut)
async def get_food_item(id: int) -> FoodOut:
    return db.get_food_item(id)


@app.put("/api/food-items/{id}", response_model=FoodOut)
async def update_food_item(id: int, item: FoodUpdate) -> FoodOut:
    updated_item = db.update_food_item(id, item)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated_item


@app.delete("/api/food-items/{id}")
async def delete_food_item(id: int):
    deleted_item = db.delete_food_item(id)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return True


@app.get("/api/recipes")
def get_recipes(ingredients: str):
    recipes = fetch_recipes(ingredients)
    if not recipes:
        raise HTTPException(status_code=404, detail="Recipes not found")
    return recipes


@app.get("/api/notifications", response_model=list[NotificationOut])
def get_notifications() -> list[NotificationOut]:
    db.check_expiring_items()
    return db.get_notifications()
