from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException
from schema import FoodIn, FoodOut, FoodUpdate
import db
from fastapi.middleware.cors import CORSMiddleware
from recipes import fetch_recipes


app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/food-items")
async def get_food_items() -> list[FoodOut]:
    return db.get_food_items()


@app.post("/api/food-items")
async def create_food_item(item: FoodIn) -> FoodOut:
    item = db.create_food_item(item)
    return item


@app.get("/api/food-items/{id}")
async def get_food_item(id: int) -> FoodOut:
    return db.get_food_item(id)


@app.put("/api/food-items/{id}")
async def update_food_item(id: int, item: FoodUpdate):
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
