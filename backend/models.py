import uuid

from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email_id = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    role = Column(String, default="staff")  # staff or admin
    verified = Column(Boolean, default=False)
    
    products = relationship("Product", back_populates="user")

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True)
    category = Column(String, index=True)
    description = Column(String)
    img = Column(String)
    quantity = Column(Integer)
    price = Column(Float)
    restock = Column(Integer)
    status = Column(String)
    addedby = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="products")

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String, ForeignKey("products.id"))
    quantity_sold = Column(Integer)
    sold_by = Column(Integer, ForeignKey("users.id"))  
    sale_date = Column(String) 

    product = relationship("Product")
    staff = relationship("User")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)