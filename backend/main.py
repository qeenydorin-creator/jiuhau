# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

app = FastAPI(title="Jiuhua Zen Tea API")

# --- 1. CORS 配置 (允许前端访问) ---
# Zeabur 部署后，请在 Zeabur 的环境变量里添加 FRONTEND_URL
# 如果没填，默认允许所有 (*) - 方便调试，但生产环境建议限制
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    os.getenv("FRONTEND_URL", "*") 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. 数据模型 (更新为匹配前端) ---
class Product(BaseModel):
    id: str
    name: str
    price: float
    category: str  # 新增
    image: str     # 新增
    desc: str      # 新增

class UserLogin(BaseModel):
    phone: str
    password: str

# --- 3. 完整数据库 (已同步 Cloudinary 图片) ---
fake_products_db = [
    { 
        "id": "p1", 
        "name": "九华御精·尊享礼盒", 
        "price": 1680.0, 
        "category": "gift", 
        "image": "https://res.cloudinary.com/dgzsameje/image/upload/v1765448060/product-slice_pfku2d.jpg", 
        "desc": "非遗大师手作包装，甄选切片，商务馈赠首选。" 
    },
    { 
        "id": "p5", 
        "name": "手工九制黄精芝麻丸", 
        "price": 198.0, 
        "category": "snack", 
        "image": "https://res.cloudinary.com/dgzsameje/image/upload/v1765448059/product-pill_swrsms.jpg", 
        "desc": "传统手工搓制，融合黑芝麻与蜂蜜，乌发养颜。" 
    },
    { 
        "id": "p2", 
        "name": "九蒸九晒黄精茶 (罐装)", 
        "price": 368.0, 
        "category": "tea", 
        "image": "https://res.cloudinary.com/dgzsameje/image/upload/v1765448060/product-tea_jefijt.jpg", 
        "desc": "汤色如琥珀，口感绵柔。每天一杯，补气养阴。" 
    },
    { 
        "id": "p3", 
        "name": "即食黄精果 (袋装)", 
        "price": 128.0, 
        "category": "snack", 
        "image": "https://res.cloudinary.com/dgzsameje/image/upload/v1765448061/product-snack_tmeau1.jpg", 
        "desc": "软糯香甜，0添加蔗糖。随时随地的元气补给站。" 
    },
    { 
        "id": "p4", 
        "name": "破壁黄精粉", 
        "price": 299.0, 
        "category": "powder", 
        "image": "https://res.cloudinary.com/dgzsameje/image/upload/v1765512159/polygonatum-powder_gonl53.jpg", 
        "desc": "超微粉碎技术，细腻易吸收。可搭配牛奶、蜂蜜食用。" 
    },
]

# --- 4. 接口 ---

@app.get("/")
def read_root():
    return {"message": "API is running!"}

@app.get("/api/products", response_model=List[Product])
def get_products():
    return fake_products_db

@app.post("/api/login")
def login(user: UserLogin):
    if user.phone == "123456" and user.password == "password":
        return {"token": "demo-token", "user": "VIP User"}
    raise HTTPException(status_code=400, detail="Login failed")
```

---

### 3. 第二步：部署后端 (Zeabur)

1.  将更新后的 `main.py` 以及 `requirements.txt`, `Dockerfile` 上传到 Zeabur (或 GitHub 连接 Zeabur)。
2.  部署成功后，Zeabur 会给你一个**公网域名**。
    * 假设生成的域名是：`https://jiuhua-api.zeabur.app`
    * 那么你的**产品接口地址**就是：`https://jiuhua-api.zeabur.app/api/products`
3.  **测试**：在浏览器里直接访问这个接口地址，看能不能看到那 5 个产品的 JSON 数据。能看到就说明后端成功了。

---

### 4. 第三步：配置前端环境 (Vercel)

你需要在 Vercel 告诉前端：“后端在哪里”。

1.  登录 Vercel 控制台，进入你的前端项目。
2.  点击 **Settings** -> **Environment Variables**。
3.  添加一个新的变量：
    * **Key**: `VITE_API_URL`
        *(注意：如果你是用 Vite 构建的 React 项目，必须用 `VITE_` 开头才能在代码里读取到)*
    * **Value**: `https://jiuhua-api.zeabur.app` (填你 Zeabur 的域名，不要带最后的 `/`)
4.  点击 **Save**，然后去 **Deployments** 页面**Redeploy** (重新部署) 一次，让变量生效。

---

### 5. 第四步：修改前端代码 (App.jsx)

最后，你需要修改 `App.jsx` 来读取这个环境变量并请求数据。

**在 App.jsx 头部添加：**

```javascript
// 获取环境变量中的后端地址
// 如果本地开发没有设置环境变量，默认用空字符串或本地地址
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
```

**修改 App 组件的数据获取逻辑：**

```javascript
// 在 App 组件内
const [products, setProducts] = useState([]); // 初始为空

useEffect(() => {
  // 定义请求函数
  const fetchProducts = async () => {
    try {
      // 拼接地址：后端域名 + /api/products
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data); // 把后端数据存入状态
      } else {
        console.error("API Error");
      }
    } catch (err) {
      console.error("Fetch Error", err);
    }
  };

  fetchProducts(); // 执行请求
}, []);