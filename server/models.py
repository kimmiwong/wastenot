from sqlalchemy import Column, Integer, String, ForeignKey, Float, Date
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class DBFood(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    expiration_date = Column(Date, nullable=False)
    category_id = Column(Integer, ForeignKey('category.category_id'), nullable=False)

class DBCategory(Base):
    __tablename__= "category"

    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String, nullable=False)
