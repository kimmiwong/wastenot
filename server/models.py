from sqlalchemy import Column, Integer, String, ForeignKey, Float, Date
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class DBFood(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    expiration_date = Column(Date, nullable=False)
    category = Column(String, nullable=False)
