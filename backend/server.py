from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str  # "yatak" or "baza"
    description: str
    features: List[str]
    specifications: dict
    image_url: str
    gallery: List[str] = []
    is_featured: bool = False
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    category: str
    description: str
    features: List[str]
    specifications: dict
    image_url: str
    gallery: List[str] = []
    is_featured: bool = False
    order: int = 0

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_read: bool = False

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

# ============ ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "İbed API - Smart Bed, Smart Sleep"}

# Products
@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["is_featured"] = featured
    
    products = await db.products.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    for p in products:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    return product

@api_router.post("/products", response_model=Product)
async def create_product(input: ProductCreate):
    product = Product(**input.model_dump())
    doc = product.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.products.insert_one(doc)
    return product

# Contact
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(input: ContactMessageCreate):
    message = ContactMessage(**input.model_dump())
    doc = message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    return message

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for m in messages:
        if isinstance(m.get('created_at'), str):
            m['created_at'] = datetime.fromisoformat(m['created_at'])
    return messages

# Seed Products
@api_router.post("/seed-products")
async def seed_products():
    # Check if products exist
    count = await db.products.count_documents({})
    if count > 0:
        return {"message": "Ürünler zaten mevcut", "count": count}
    
    products = [
        # 1. İBED ROYAL LUXURY POCKET - En Kaliteli
        {
            "id": str(uuid.uuid4()),
            "name": "İBED Royal Luxury Pocket",
            "category": "yatak",
            "description": "En üst segment yatak modelimiz. 7 katmanlı özel yapısı ile eşsiz konfor ve destek sağlar. Torba paket yay çekirdeği ile bağımsız destek teknolojisi sunar.",
            "features": [
                "Kapitone Katmanı (380gr Örme Kumaş + 400gr Deve/Koyun Yünü + 0.8cm Sünger)",
                "2cm At Kılı",
                "5cm Lateks",
                "2cm 28dns Soft Sünger",
                "2cm (1000gr) Hindistan Cevizi Lifi",
                "1000gr Vatka",
                "Torba Paket Yay Çekirdeği (Bağımsız Destek)"
            ],
            "specifications": {
                "Yükseklik": "35-38 cm (Tahmini)",
                "Yay Sistemi": "Torba Paket Yay",
                "Kullanım": "Tek Yönlü",
                "Kumaş": "380gr Örme Kumaş",
                "Yan Bordür": "Siyah (Petek Desenli)",
                "Ölçüler": "90x190 cm / 150x200 cm"
            },
            "image_url": "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/634ni718_10.png",
            "gallery": [
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/634ni718_10.png",
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/6g0ryq3y_en%20konforlu%20.png"
            ],
            "is_featured": True,
            "order": 1,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # 2. İBED LUXURY POCKET
        {
            "id": str(uuid.uuid4()),
            "name": "İBED Luxury Pocket",
            "category": "yatak",
            "description": "Premium segment yatak modelimiz. 6 katmanlı yapısı ve çift yönlü kullanım özelliği ile uzun ömürlü konfor. Torba paket yay sistemi ile bağımsız destek sağlar.",
            "features": [
                "400gr Tavşantüyü Kumaş (Beyaz) + 300gr Elyaf + 1.5cm Sünger (Kapitone)",
                "2cm Soft Sünger",
                "2cm Sert Sünger",
                "2cm Thermobont Vatka",
                "Torba Paket Yay Çekirdeği (Bağımsız Destek)",
                "Alt Taraf Simetrisi (Katmanlar 1-4 Tekrar)"
            ],
            "specifications": {
                "Yükseklik": "37-40 cm (Tahmini)",
                "Yay Sistemi": "Torba Paket Yay",
                "Kullanım": "Çift Yönlü",
                "Kumaş": "Tavşantüyü Örme Kumaş",
                "Renk Seçenekleri": "Bej, Gri, Kahverengi, Beyaz",
                "Desen": "Baklava/Petek",
                "Ölçüler": "90x190 cm / 150x200 cm"
            },
            "image_url": "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/ud9rmqex_11.png",
            "gallery": [
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/ud9rmqex_11.png",
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/3cqur0hd_10.png"
            ],
            "is_featured": True,
            "order": 2,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # 3. İBED TITANIUM SUPPORT
        {
            "id": str(uuid.uuid4()),
            "name": "İBED Titanium Support",
            "category": "yatak",
            "description": "Sarsılmaz Destek, Modern Estetik. 7 katmanlı yapısı ve güçlendirilmiş Herkül yay sistemi ile ekstra dayanıklılık ve destek sunar. Çift yönlü kullanım özelliği.",
            "features": [
                "240gr Örme Kumaş (Modern Desen)",
                "300gr Elyaf + 1.5cm Soft Sünger (Kapitone)",
                "2cm Soft Sünger",
                "2cm Sert Sünger",
                "1200gr Sert Keçe",
                "Herkül Yay Çekirdeği (Bağlantılı Teller)",
                "Alt Taraf Simetrisi"
            ],
            "specifications": {
                "Yükseklik": "32-34 cm (Tahmini)",
                "Yay Sistemi": "Herkül Yay (Güçlendirilmiş)",
                "Kullanım": "Çift Yönlü",
                "Kumaş": "240gr Örme Kumaş",
                "Yan Bordür": "Gri Keten",
                "Ölçüler": "90x190 cm / 150x200 cm"
            },
            "image_url": "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/rfp4t1a3_12.png",
            "gallery": [
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/rfp4t1a3_12.png",
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/75xxs6tb_11.png"
            ],
            "is_featured": True,
            "order": 3,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # 4. İBED CLASSIC BASE (Bej - Rustik)
        {
            "id": str(uuid.uuid4()),
            "name": "İBED Classic Base",
            "category": "yatak",
            "description": "Klasik tasarım, güvenilir kalite. 6 katmanlı yapısı ve Herkül yay sistemi ile sağlam destek. Tek yönlü pedli kullanım özelliği. Bej keten yan bordür ile şık görünüm.",
            "features": [
                "240gr Örme Kumaş",
                "300gr Elyaf + 0.8cm Sünger (Kapitone)",
                "5cm Soft Sünger (Ped Bölgü)",
                "2cm Sert Sünger",
                "1200gr Keçe",
                "Herkül Yay Çekirdeği (Bağlantılı Teller)"
            ],
            "specifications": {
                "Yükseklik": "32-34 cm (Tahmini)",
                "Yay Sistemi": "Herkül Yay",
                "Kullanım": "Tek Yönlü (Pedli)",
                "Kumaş": "240gr Örme Kumaş",
                "Yan Bordür": "Bej Keten Kumaş",
                "Ölçüler": "90x190 cm / 150x200 cm"
            },
            "image_url": "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/7h3jxag6_13.png",
            "gallery": [
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/7h3jxag6_13.png",
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/pywd3bf9_12.png"
            ],
            "is_featured": False,
            "order": 4,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # 5. İBED CLASSIC BASE NAVY (Lacivert)
        {
            "id": str(uuid.uuid4()),
            "name": "İBED Classic Base Navy",
            "category": "yatak",
            "description": "Klasik tasarım, modern estetik. 6 katmanlı yapısı ve Herkül yay sistemi ile sağlam destek. Lacivert kadife kumaş ile şık ve zarif görünüm.",
            "features": [
                "240gr Örme Kumaş",
                "300gr Elyaf + 0.8cm Sünger (Kapitone)",
                "5cm Soft Sünger (Ped Bölgü)",
                "2cm Sert Sünger",
                "1200gr Keçe",
                "Herkül Yay Çekirdeği (Bağlantılı Teller)"
            ],
            "specifications": {
                "Yükseklik": "32-34 cm (Tahmini)",
                "Yay Sistemi": "Herkül Yay",
                "Kullanım": "Tek Yönlü (Pedli)",
                "Kumaş": "240gr Örme Kumaş",
                "Yan Bordür": "Lacivert Kadife Kumaş",
                "Ölçüler": "90x190 cm / 150x200 cm"
            },
            "image_url": "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/333vteli_15.png",
            "gallery": [
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/333vteli_15.png",
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/stmmcdh2_14.png"
            ],
            "is_featured": False,
            "order": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # 6. İBED POCKET LITE
        {
            "id": str(uuid.uuid4()),
            "name": "İBED Pocket Lite",
            "category": "yatak",
            "description": "Ekonomik fiyat, torba yay konforu. 7 katmanlı yapısı ve torba paket yay sistemi ile bütçe dostu premium deneyim. Çift yönlü kullanım ve Roll-Pack uygunluğu.",
            "features": [
                "180gr Örme Kumaş (Beyaz)",
                "150gr Elyaf + 0.8cm Sünger (Kapitone)",
                "2cm Soft Sünger",
                "2cm Sert Sünger",
                "1000gr Beyaz Keçe",
                "Torba Paket Yay Çekirdeği",
                "Alt Taraf Simetrisi"
            ],
            "specifications": {
                "Yükseklik": "28-30 cm (Tahmini)",
                "Yay Sistemi": "Torba Yay",
                "Kullanım": "Çift Yönlü",
                "Kumaş": "180gr Örme Kumaş",
                "Yan Bordür": "Kahverengi Petek Kumaş",
                "Roll-Pack": "Uygun",
                "Ölçüler": "90x180 cm / 150x200 cm"
            },
            "image_url": "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/xyhkhbei_14.png",
            "gallery": [
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/xyhkhbei_14.png",
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/6sb3wh8r_13.png"
            ],
            "is_featured": False,
            "order": 6,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # 7. İBED SMART POCKET
        {
            "id": str(uuid.uuid4()),
            "name": "İBED Smart Pocket",
            "category": "yatak",
            "description": "Akıllı tasarım, akıllı uyku. 6 katmanlı yapısı ve torba yay sistemi ile uygun fiyatlı premium konfor. Çift yönlü kullanım ve Roll-Pack uygunluğu.",
            "features": [
                "180gr Örme Kumaş (Beyaz)",
                "90gr Elyaf + 0.8cm Sünger (Kapitone)",
                "2cm Soft Sünger",
                "1000gr Keçe",
                "Torba Paket Yay Çekirdeği",
                "Alt Taraf Simetrisi"
            ],
            "specifications": {
                "Yükseklik": "25 cm (Tahmini)",
                "Yay Sistemi": "Torba Yay",
                "Kullanım": "Çift Yönlü",
                "Kumaş": "180gr Örme Kumaş",
                "Yan Bordür": "Jakarlı Kumaş",
                "Roll-Pack": "Uygun",
                "Ölçüler": "90x150 cm / 150x200 cm"
            },
            "image_url": "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/m30kjnyn_16.png",
            "gallery": [
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/m30kjnyn_16.png",
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/aiw38sv7_14.png",
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/mn9uyaok_15.png"
            ],
            "is_featured": False,
            "order": 6,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.products.insert_many(products)
    return {"message": "Ürünler başarıyla eklendi", "count": len(products)}

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
