from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

app = FastAPI(title="Jiuhua Zen Tea API")

# --- CORS 配置 ---
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    # 获取环境变量，如果没有则允许所有 (*)
    os.getenv("FRONTEND_URL", "*")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 数据模型 ---
class ProductUpdate(BaseModel):
    price: Optional[float] = None
    stock: Optional[int] = None

class Product(BaseModel):
    id: str
    name: str
    price: float
    stock: int
    category: str
    image: str
    desc: str

class UserLogin(BaseModel):
    phone: str
    password: str

# --- 模拟数据库 ---
fake_products_db = [
    { 
        "id": "p1", 
        "name": "九华御精·尊享礼盒", 
        "price": 1680.0, 
        "stock": 50,
        "category": "gift", 
        "image": "https://res.cloudinary.com/dgzsameje/image/upload/v1765448060/product-slice_pfku2d.jpg", 
        "desc": "非遗大师手作包装，甄选切片，商务馈赠首选。" 
    },
    { 
        "id": "p5", 
        "name": "手工九制黄精芝麻丸", 
        "price": 198.0, 
        "stock": 200,
        "category": "snack", 
        "image": "https://res.cloudinary.com/dgzsameje/image/upload/v1765448059/product-pill_swrsms.jpg", 
        "desc": "传统手工搓制，融合黑芝麻与蜂蜜，乌发养颜。" 
    },
    { 
        "id": "p2", 
        "name": "九蒸九晒黄精茶 (罐装)", 
        "price": 368.0, 
        "stock": 120,
        "category": "tea", 
        "image": "https://res.cloudinary.com/dgzsameje/image/upload/v1765448060/product-tea_jefijt.jpg", 
        "desc": "汤色如琥珀，口感绵柔。每天一杯，补气养阴。" 
    },
    { 
        "id": "p3", 
        "name": "即食黄精果 (袋装)", 
        "price": 128.0, 
        "stock": 300,
        "category": "snack", 
        "image": "https://res.cloudinary.com/dgzsameje/image/upload/v1765448061/product-snack_tmeau1.jpg", 
        "desc": "软糯香甜，0添加蔗糖。随时随地的元气补给站。" 
    },
    { 
        "id": "p4", 
        "name": "破壁黄精粉", 
        "price": 299.0, 
        "stock": 80,
        "category": "powder", 
        "image": "https://res.cloudinary.com/dgzsameje/image/upload/v1765512159/polygonatum-powder_gonl53.jpg", 
        "desc": "超微粉碎技术，细腻易吸收。可搭配牛奶、蜂蜜食用。" 
    },
]

# --- 接口 ---

@app.get("/")
def read_root():
    return {"message": "API is running!"}

@app.get("/api/products", response_model=List[Product])
def get_products():
    return fake_products_db

@app.put("/api/products/{product_id}", response_model=Product)
def update_product(product_id: str, update_data: ProductUpdate):
    for product in fake_products_db:
        if product["id"] == product_id:
            if update_data.price is not None:
                product["price"] = update_data.price
            if update_data.stock is not None:
                product["stock"] = update_data.stock
            return product
    raise HTTPException(status_code=404, detail="Product not found")

@app.post("/api/login")
def login(user: UserLogin):
    if user.phone == "123456" and user.password == "password":
        return {"token": "admin-token", "user": "Admin", "role": "admin"}
    raise HTTPException(status_code=400, detail="Login failed")
