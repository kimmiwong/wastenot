from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from schema import FoodIn, FoodOut, FoodUpdate, NotificationOut
from models import DBFood, DBNotification
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5432/pantry"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_food_items() -> list[FoodOut]:
    db = SessionLocal()
    db_items = db.query(DBFood).order_by(DBFood.name).all()
    items = []
    for db_item in db_items:
        items.append(FoodOut(
            id=db_item.id,
            name=db_item.name,
            expiration_date=db_item.expiration_date,
            category_id=db_item.category_id
        ))
    db.close()
    return items


def create_food_item(item: FoodIn) -> FoodOut:
    db = SessionLocal()
    db_item = DBFood(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    item = FoodOut(
        id=db_item.id,
        name=db_item.name,
        expiration_date=db_item.expiration_date,
        category_id=db_item.category_id
    )
    db.close()
    return item


def update_food_item(id: int, item: FoodUpdate) -> FoodOut:
    db = SessionLocal()
    db_item = db.query(DBFood).filter(DBFood.id == id).first()
    if item.name is not None:
        db_item.name = item.name
    if item.expiration_date is not None:
        db_item.expiration_date = item.expiration_date

    if item.category_id is not None:
        db_item.category_id = item.category_id

    db.commit()
    db.refresh(db_item)
    db.close()

    return FoodOut(
        id=db_item.id,
        name=db_item.name,
        expiration_date=db_item.expiration_date,
        category_id=db_item.category_id
        )


def delete_food_item(id: int) -> bool:
    db = SessionLocal()
    db_item = db.query(DBFood).filter(DBFood.id == id).first()
    db.delete(db_item)
    db.commit()
    db.close()
    return True


def get_food_item(id: int) -> FoodOut:
    db = SessionLocal()
    db_item = db.query(DBFood).filter(DBFood.id == id).first()
    db.close()
    return FoodOut(
        id=db_item.id,
        name=db_item.name,
        expiration_date=db_item.expiration_date,
        category_id=db_item.category_id

    )


def check_expiring_items():
    db = SessionLocal()
    today = datetime.now(ZoneInfo("America/New_York")).date()
    db_food_items = db.query(DBFood).all()

    for db_food_item in db_food_items:
        days_diff = (db_food_item.expiration_date - today).days

        if days_diff > 2:
            existing = db.query(DBNotification).filter(DBNotification.food_id == db_food_item.id).first()
            if existing:
                db.delete(existing)
            continue

        if days_diff == 2:
            message = f"{db_food_item.name} expires in 2 days!"
        elif days_diff == 1:
            message = f"{db_food_item.name} expires in 1 day!"
        elif days_diff == 0:
            message = f"{db_food_item.name} expires today!"
        elif days_diff == -1:
            message = f"{db_food_item.name} expired 1 day ago!"
        elif days_diff < -1:
            message = f"{db_food_item.name} expired {abs(days_diff)} days ago!"

        db_notification = db.query(DBNotification).filter(DBNotification.food_id == db_food_item.id).first()
        if db_notification:
            db_notification.message = message
            db_notification.created_at = datetime.now(timezone.utc)
        else:
            db.add(DBNotification(message=message, food_id=db_food_item.id))
    db.commit()
    db.close()


def get_notifications() -> list[NotificationOut]:
    db = SessionLocal()
    db_notifications = db.query(DBNotification).order_by(DBNotification.created_at.desc()).all()
    notifications = []
    for db_notification in db_notifications:
        notifications.append(NotificationOut(
            notification_id=db_notification.notification_id,
            message=db_notification.message,
            created_at=db_notification.created_at,
            food_id=db_notification.food_id
        ))
    db.close()
    return notifications
