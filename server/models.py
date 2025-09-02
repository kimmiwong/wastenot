from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime, Boolean
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime, timezone
from sqlalchemy.ext.declarative import declarative_base
from typing import Optional

Base = declarative_base()


class DBFood(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    expiration_date = Column(Date, nullable=False)
    category_id = Column(Integer, ForeignKey('category.category_id'), nullable=False)
    added_by_id = Column(Integer, ForeignKey('account.id'), nullable=False)
    household_id = Column(Integer, ForeignKey('household.id'), nullable=False)

    notification = relationship("DBNotification", back_populates="food", cascade="all, delete-orphan")
    household = relationship("DBHousehold", back_populates="food_items")
    added_by = relationship("DBAccount", back_populates="added_food_items")


class DBCategory(Base):
    __tablename__ = "category"

    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String, nullable=False)


class DBNotification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    food_id = Column(Integer, ForeignKey('food_items.id', ondelete="CASCADE"))

    food = relationship("DBFood", back_populates="notification")


class DBAccount(Base):
    __tablename__: str = "account"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    session_token: Mapped[Optional[str]] = mapped_column(nullable=True)
    session_expires_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    security_question: Mapped[str] = mapped_column(nullable=True)
    security_answer_hash: Mapped[str] = mapped_column(nullable=True)

    favorite_recipes = relationship("DBFavoriteRecipe", back_populates="user", cascade="all, delete-orphan")
    household_membership = relationship("DBHouseholdMembership", back_populates="user", uselist=False)
    admin_household = relationship("DBHousehold", back_populates="admin", foreign_keys="DBHousehold.admin_user_id")
    added_food_items = relationship("DBFood", back_populates="added_by", cascade="all, delete-orphan")



class DBFavoriteRecipe(Base):
    __tablename__ = "favorite_recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey('account.id'), nullable=False)
    recipe_id = Column(String, nullable=False)
    source_url = Column(String, nullable=True)

    user = relationship("DBAccount", back_populates="favorite_recipes")


class DBHouseholdMembership(Base):
    __tablename__ = "user_household"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("account.id", ondelete="CASCADE"), unique=True, nullable=False)
    household_id = Column(Integer, ForeignKey("household.id", ondelete="CASCADE"), nullable=False)
    pending = Column(Boolean, default=True)

    user = relationship("DBAccount", back_populates="household_membership")
    household = relationship("DBHousehold", back_populates="memberships")


class DBHousehold(Base):
    __tablename__ = "household"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    invite_id = Column(String, unique=True, nullable=False)
    admin_user_id = Column(Integer, ForeignKey("account.id"), nullable=False)

    memberships = relationship("DBHouseholdMembership", back_populates="household", passive_deletes=True)
    food_items = relationship("DBFood", back_populates="household", cascade="all, delete-orphan")
    admin = relationship("DBAccount", back_populates="admin_household", foreign_keys=[admin_user_id])
