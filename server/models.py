from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column
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


class DBAccount(Base):
    __tablename__: str = "account"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    session_token: Mapped[str] = mapped_column(nullable=True)
    session_expires_at: Mapped[datetime] = mapped_column(nullable=True)
