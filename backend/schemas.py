from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email_id: EmailStr
    first_name: str
    last_name: str
    password: str
    role: str = "staff"  # staff or admin

class UserResponse(BaseModel):
    id: int
    username: str
    email_id: str
    first_name: str
    last_name: str
    role: str
    verified: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str 

class ProductResponse(BaseModel):
    id: str # PK for produtc
    name: str
    category: str
    description: str
    img: str
    quantity: int
    price: float
    restock: int
    status: str
    addedby: int # foreign key to users table

class ProductCreate(BaseModel):
    # Creatt Schema doesn't have PK as it get created and then it is given PK 
    name: str 
    category: str
    description: str
    img: str
    quantity: int
    price: float
    restock: int
    status: str
    addedby: int # foreign key to users table

class ProductUpdate(BaseModel):
    # Update Schema has all optional fields for partial updates
    name: str | None = None
    category: str | None = None
    description: str | None = None
    img: str | None = None
    quantity: int | None = None
    price: float | None = None
    restock: int | None = None
    status: str | None = None

class PaginatedProductResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


