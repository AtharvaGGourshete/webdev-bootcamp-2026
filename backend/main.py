from fastapi import FastAPI, Depends, Form, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
import json
import models
import schemas
from database import engine, get_db
from auth import hash_password, verify_password, create_access_token, get_current_user

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP methods
    allow_headers=["*"],  # allow all headers
)

@app.post("/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Checking if username n email already exists
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    db_email = db.query(models.User).filter(models.User.email_id == user.email_id).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate role
    if user.role not in ["staff", "admin"]:
        raise HTTPException(status_code=400, detail="Role must be 'staff' or 'admin'")
    
    hashed_password = hash_password(user.password)
    
    # Admin is always verified, staff needs verification
    verified = True if user.role == "admin" else False
    
    new_user = models.User(
        username=user.username,
        email_id=user.email_id,
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed_password,
        role=user.role,
        verified=verified
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login", response_model=schemas.Token)
def login(
    email: str = Form(...),     
    password: str = Form(...),   
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email_id == email).first()
    
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if user.role == "staff" and not user.verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is pending admin approval."
        )

    access_token = create_access_token(data={"sub": user.email_id})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role, "user_id": user.id}


@app.put("/users/verify/{user_id}", response_model=schemas.UserResponse)
def verify_staff(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can verify staff")
    
    user = db.query(models.User).filter(models.User.id == user_id, models.User.role == "staff").first()
    if not user:
        raise HTTPException(status_code=404, detail="Staff user not found")
    
    user.verified = True
    db.commit()
    db.refresh(user)
    return user


@app.get("/users/unverified", response_model=list[schemas.UserResponse])
def list_unverified_staff(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can see unverified staff")
    
    staff_list = db.query(models.User).filter(models.User.role == "staff", models.User.verified == False).all()
    return staff_list

# Product endpoints

@app.post("/products", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_product = models.Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@app.get("/products", response_model=schemas.PaginatedProductResponse)
def list_products(page: int = 1, page_size: int = 10, category: str | None = None, db: Session = Depends(get_db)):
    query = db.query(models.Product)
    
    if category:
        query = query.filter(models.Product.category == category)
    
    total = query.count()
    total_pages = (total + page_size - 1) // page_size
    
    products = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "items": products,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }

@app.get("/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.put("/products/{product_id}", response_model=schemas.ProductResponse)
def update_product(product_id: str, product_update: schemas.ProductUpdate,db: Session = Depends(get_db),current_user: models.User = Depends(get_current_user)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    return product

@app.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return None

@app.post("/sales", response_model=schemas.SaleResponse, status_code=status.HTTP_201_CREATED)
def create_sale(sale: schemas.SaleCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):

    product = db.query(models.Product).filter(models.Product.id == sale.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if sale.quantity_sold > product.quantity:
        raise HTTPException(status_code=400, detail=f"Not enough stock. Available: {product.quantity}")
    
    product.quantity -= sale.quantity_sold

    new_sale = models.Sale(
        product_id=sale.product_id,
        quantity_sold=sale.quantity_sold,
        sold_by=current_user.id,
        sale_date=str(date.today())
    )

    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)
    return new_sale

@app.get("/stats")
def get_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    total_products = db.query(models.Product).count()
    
    total_sales = db.query(func.sum(models.Sale.quantity_sold)).scalar() or 0
    
    sales = db.query(models.Sale).all()
    total_revenue = 0
    for sale in sales:
        product = db.query(models.Product).filter(models.Product.id == sale.product_id).first()
        if product:
            total_revenue += sale.quantity_sold * product.price

    low_stock = db.query(models.Product).filter(models.Product.quantity <= models.Product.restock).count()

    return {
        "total_products": total_products,
        "total_sales": total_sales,
        "total_revenue": total_revenue,
        "low_stock": low_stock
    }

@app.post("/categories", response_model=schemas.CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can add categories")
    
    existing = db.query(models.Category).filter(models.Category.name == category.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")
    
    new_category = models.Category(name=category.name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@app.get("/categories", response_model=list[schemas.CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@app.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can delete categories")
    
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(category)
    db.commit()
    return None

@app.get("/reports")
def get_reports(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    sales = db.query(models.Sale).all()

    product_report = {} 
    category_report = {}  

    for sale in sales:
        product = db.query(models.Product).filter(models.Product.id == sale.product_id).first()
        if not product:
            continue

        revenue = sale.quantity_sold * product.price

        if product.name not in product_report:
            product_report[product.name] = {"quantity": 0, "revenue": 0}
        product_report[product.name]["quantity"] += sale.quantity_sold
        product_report[product.name]["revenue"] += revenue

        if product.category not in category_report:
            category_report[product.category] = {"quantity": 0, "revenue": 0}
        product.category and category_report[product.category]["quantity"].__class__ 
        category_report[product.category]["quantity"] += sale.quantity_sold
        category_report[product.category]["revenue"] += revenue

    return {
        "by_product": product_report,
        "by_category": category_report
    }