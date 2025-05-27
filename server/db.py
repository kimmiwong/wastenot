from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from schema import FoodIn, FoodOut, FoodUpdate, NotificationIn, NotificationOut
from models import DBFood, DBNotification
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta, timezone

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
    db_item= DBFood(**item.model_dump())
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
    db_item = db.query(DBFood).filter(DBFood.id==id).first()
    if item.name is not None:
        db_item.name = item.name
    if item.expiration_date is not None:
        db_item.expiration_date = item.expiration_date

    if item.category_id is not None:
        db_item.category_id  = item.category_id

    db.commit()
    db.refresh(db_item)
    db.close()

    return FoodOut(
        id=db_item.id,
        name=db_item.name,
        expiration_date=db_item.expiration_date,
        category_id=db_item.category_id)


def delete_food_item(id: int) -> bool:
    db = SessionLocal()
    db_item = db.query(DBFood).filter(DBFood.id==id).first()
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
    today = datetime.now(timezone.utc).date()
    for days_left in [2, 1, 0]:
        target_date = today + timedelta(days=days_left)
        db_items = db.query(DBFood).filter(DBFood.expiration_date == target_date).all()
        for db_item in db_items:
            if days_left == 0:
                message = f"'{db_item.name}' expires today!"
            else:
                message = f"'{db_item.name}' expires in {days_left} day(s)."
            db_notification = DBNotification(message=message)
            db.add(db_notification)
    db.commit()
    db.close()

    scheduler = BackgroundScheduler()
    scheduler.add_job(check_expiring_items, 'interval', days=1)
    scheduler.start()


def get_notifications() -> list[NotificationOut]:
    db = SessionLocal()
    db_notifications = db.query(DBNotification).order_by(DBNotification.created_at.desc()).all()
    notifications = []
    for db_notification in db_notifications:
        notifications.append(NotificationOut(
            notification_id=db_notification.notification_id,
            message=db_notification.message,
            created_at=db_notification.created_at
        ))
    db.close()
    return notifications
