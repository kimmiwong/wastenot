from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class DBFood(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    expiration_date = Column(Date, nullable=False)
    category_id = Column(Integer, ForeignKey('category.category_id'), nullable=False)

    notification = relationship("DBNotification", back_populates="food", cascade="all, delete-orphan")


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
