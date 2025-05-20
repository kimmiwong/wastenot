from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from schema import FoodIn, FoodOut, FoodUpdate
from models import DBFood
DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5432/pantry"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_items() -> list[FoodOut]:
    db = SessionLocal()
    db_items = db.query(DBFood).all()
    items = []
    for db_item in db_items:
        items.append(FoodOut(
            id=db_item.id,
            name=db_item.name,
            expiration_date=db_item.expiration_date,
            category=db_item.category
        ))
    db.close()
    return items

def create_item(item: FoodIn) -> FoodOut:
    db = SessionLocal()
    db_item= DBFood(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    item = FoodOut(
        id=db_item.id,
        name=db_item.name,
        expiration_date=db_item.expiration_date,
        category=db_item.category
    )
    db.close()
    return item

def update_item(id: int, item: FoodUpdate) -> FoodOut:
    db = SessionLocal()
    db_item = db.query(DBFood).filter(DBFood.id==id).first()
    if item.name is not None:
        db_item.name = item.name
    if item.expiration_date is not None:
        db_item.expiration_date = item.expiration_date

    if item.category is not None:
        db_item.category  = item.category

    db.commit()
    db.refresh(db_item)
    db.close()

    return FoodOut(
        id=db_item.id,
        name=db_item.name,
        expiration_date=db_item.expiration_date,
        category=db_item.category)

def delete_item(id: int) -> bool:
    db = SessionLocal()
    db_item = db.query(DBFood).filter(DBFood.id==id).first()
    db.delete(db_item)
    db.commit()
    db.close()
    return True
