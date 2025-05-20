from fastapi import FastAPI, HTTPException
from schema import FoodIn, FoodOut, FoodUpdate
import db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/pantry")
async def get_items() -> list[FoodOut]:
    return db.get_items()


@app.post("/api/pantry")
async def create_item(item: FoodIn) -> FoodOut:
    item = db.create_item(item)
    return item


@app.put("/api/pantry/{id}")
async def update_item(id: int, item: FoodUpdate):
    updated_item = db.update_item(id, item)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated_item


@app.delete("/api/pantry/{id}")
async def delete_item(id: int):
    deleted_item = db.delete_item(id)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return True
