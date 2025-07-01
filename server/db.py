from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from schema import FoodIn, FoodOut, FoodUpdate, NotificationOut, UserPublicDetails, UserIn
from models import DBFood, DBNotification, DBAccount
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo
from dotenv import load_dotenv
import os
from secrets import token_urlsafe
import bcrypt

load_dotenv()
database_url = os.getenv("DATABASE_URL")
SESSION_LIFE_MINUTES = 120

engine = create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_food_items(current_user: UserIn) -> list[FoodOut]:
    db = SessionLocal()
    db_items = db.query(DBFood).filter(DBFood.user_id == current_user.id).order_by(DBFood.name).all()
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


def create_food_item(item: FoodIn, current_user: UserIn) -> FoodOut:
    db = SessionLocal()

    item_data = item.model_dump()
    item_data["user_id"] = current_user.id

    db_item = DBFood(**item_data)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    db.close()

    return FoodOut(
        id=db_item.id,
        name=db_item.name,
        expiration_date=db_item.expiration_date,
        category_id=db_item.category_id
    )


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


def get_notifications_for_current_user(current_user: UserIn) -> list[NotificationOut]:
    db = SessionLocal()
    db_notifications = (
        db.query(DBNotification)
        .join(DBNotification.food)
        .filter(DBFood.user_id == current_user.id)
        .order_by(DBNotification.created_at.desc())
        .all()
        )
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


def validate_username_password(username: str, password: str) -> str | None:
    with SessionLocal() as db:
        account = (
            db.query(DBAccount).filter(DBAccount.username == username).first()
        )
        if not account:
            return None
        valid_credentials = bcrypt.checkpw(
            password.encode(), account.hashed_password.encode()
        )
        if not valid_credentials:
            return None
        session_token = token_urlsafe()
        account.session_token = session_token
        expires = datetime.now() + timedelta(minutes=SESSION_LIFE_MINUTES)
        # assign as datetime, not isoformat
        account.session_expires_at = expires
        db.commit()
        return session_token


def validate_session(username: str, session_token: str) -> bool:
    with SessionLocal() as db:
        account = (
            db.query(DBAccount)
            .filter(
                DBAccount.username == username,
                DBAccount.session_token == session_token,
            )
            .first()
        )
        if not account:
            return False

        if datetime.now() >= account.session_expires_at:
            return False

        expires = datetime.now() + timedelta(minutes=SESSION_LIFE_MINUTES)

        account.session_expires_at = expires
        db.commit()
        return True


def invalidate_session(username: str, session_token: str) -> None:
    with SessionLocal() as db:
        account = (
            db.query(DBAccount)
            .filter(
                DBAccount.username == username,
                DBAccount.session_token == session_token,
            )
            .first()
        )
        if not account:
            return

        account.session_token = f"expired-{token_urlsafe()}"
        db.commit()


def create_user_account(username: str, password: str) -> bool:
    with SessionLocal() as db:
        if db.query(DBAccount).filter(DBAccount.username == username).first():
            return False
        hashed_password = bcrypt.hashpw(
            password.encode(), bcrypt.gensalt()
        ).decode()
        account = DBAccount(
            username=username,
            hashed_password=hashed_password,
            session_token=None,
            session_expires_at=None,
        )
        db.add(account)
        db.commit()
        return True


def get_user_public_details(username: str):
    with SessionLocal() as db:
        account = (
            db.query(DBAccount).filter(DBAccount.username == username).first()
        )
        if not account:
            return None
        return UserPublicDetails(username=account.username)


def get_user_by_username(username: str) -> DBAccount | None:
    with SessionLocal() as db:
        return db.query(DBAccount).filter(DBAccount.username == username).first()
