from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from schema import FoodIn, FoodOut, FoodUpdate, NotificationOut, UserPublicDetails
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


def validate_username_password(username: str, password: str) -> str | None:
    """
    Validate a username and password against the database. If valid,
    generates a new session token, updates the session expiration, and
    returns the session token. Returns None if credentials are invalid.
    """
    # retrieve the user account from the database
    with SessionLocal() as db:
        account = (
            db.query(DBAccount).filter(DBAccount.username == username).first()
        )
        if not account:
            return None

        # validate the provided credentials (username & password)
        valid_credentials = bcrypt.checkpw(
            password.encode(), account.hashed_password.encode()
        )
        if not valid_credentials:
            return None

        # create a new session token and set the expiration date
        session_token = token_urlsafe()
        account.session_token = session_token
        expires = datetime.now() + timedelta(minutes=SESSION_LIFE_MINUTES)
        # assign as datetime, not isoformat
        account.session_expires_at = expires
        db.commit()
        return session_token


def validate_session(username: str, session_token: str) -> bool:
    """
    Validate a session token for a given username. Returns True if the
    session is valid and not expired, and updates the session expiration.
    Returns False otherwise.
    """
    # retrieve the user account for the given session token
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

        # validate that it is not expired
        if datetime.now() >= account.session_expires_at:
            return False

        # update the expiration date and save to the database
        expires = datetime.now() + timedelta(minutes=SESSION_LIFE_MINUTES)
        # assign as datetime, not isoformat
        account.session_expires_at = expires
        db.commit()
        return True


def invalidate_session(username: str, session_token: str) -> None:
    """
    Invalidate a user's session by setting the session token to a unique
    expired value.
    """
    # retrieve the user account for the given session token
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

        # set the token to an invalid value that is unique
        account.session_token = f"expired-{token_urlsafe()}"
        db.commit()


def create_user_account(username: str, password: str) -> bool:
    """
    Create a new user account with the given username and password.
    Returns True if the account was created successfully, or False if the
    username exists.
    """
    # Create a new user account.
    # Returns True if successful, False if username exists.
    with SessionLocal() as db:
        # Check if username already exists
        if db.query(DBAccount).filter(DBAccount.username == username).first():
            return False
        # Hash the password using bcrypt before storing it in the database.
        # bcrypt.hashpw returns a hashed password as bytes,
        # which we decode to a string.
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
    """
    Fetch public details for a user by username. Returns a UserPublicDetails
    object if found, or None if not found.
    """

    with SessionLocal() as db:
        account = (
            db.query(DBAccount).filter(DBAccount.username == username).first()
        )
        if not account:
            return None
        return UserPublicDetails(username=account.username)
