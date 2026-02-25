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
        # YATAK (Mattress) Products
        {
            "id": str(uuid.uuid4()),
            "name": "Premium Ortopedik Yatak",
            "category": "yatak",
            "description": "Yüksek yoğunluklu bellek köpüğü ile üstün konfor ve omurga desteği sağlar. 7 bölgeli ergonomik yapısı ile vücudunuzun her noktasına özel destek sunar.",
            "features": [
                "7 Bölgeli Ergonomik Tasarım",
                "Yüksek Yoğunluklu Bellek Köpüğü",
                "Sıcaklık Dengeleyici Teknoloji",
                "Anti-Alerjik Kumaş",
                "10 Yıl Garanti"
            ],
            "specifications": {
                "Yükseklik": "30 cm",
                "Sertlik": "Orta-Sert",
                "Kumaş": "Örme Viskon",
                "Dolgu": "Yüksek Yoğunluklu Sünger"
            },
            "image_url": "https://images.unsplash.com/photo-1648634158203-199accfd7afc?crop=entropy&cs=srgb&fm=jpg&q=85",
            "gallery": [
                "https://images.unsplash.com/photo-1648634158203-199accfd7afc?crop=entropy&cs=srgb&fm=jpg&q=85",
                "https://images.pexels.com/photos/4177628/pexels-photo-4177628.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            ],
            "is_featured": True,
            "order": 1,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Smart Sleep Yatak",
            "category": "yatak",
            "description": "Akıllı uyku teknolojisi ile donatılmış, vücut hareketlerinize uyum sağlayan dinamik yatak. Gece boyu ideal uyku pozisyonu için otomatik ayarlama yapar.",
            "features": [
                "Dinamik Destek Sistemi",
                "Hava Kanallı Yapı",
                "Çift Taraflı Kullanım",
                "Nem Dengeleyici",
                "15 Yıl Garanti"
            ],
            "specifications": {
                "Yükseklik": "35 cm",
                "Sertlik": "Ayarlanabilir",
                "Kumaş": "Bambu Karışımlı",
                "Dolgu": "Latex + Bellek Köpük"
            },
            "image_url": "https://images.pexels.com/photos/7598137/pexels-photo-7598137.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "gallery": [
                "https://images.pexels.com/photos/7598137/pexels-photo-7598137.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                "https://images.unsplash.com/photo-1664347760452-6d5d22d6155a?crop=entropy&cs=srgb&fm=jpg&q=85"
            ],
            "is_featured": True,
            "order": 2,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Natural Latex Yatak",
            "category": "yatak",
            "description": "100% doğal latex ile üretilmiş, çevre dostu ve sağlıklı uyku deneyimi. Doğal hava sirkülasyonu ile yaz-kış konforlu uyku.",
            "features": [
                "100% Doğal Latex",
                "Eko-Sertifikalı",
                "Doğal Antimikrobiyal",
                "Pin-Hole Teknolojisi",
                "20 Yıl Garanti"
            ],
            "specifications": {
                "Yükseklik": "28 cm",
                "Sertlik": "Orta",
                "Kumaş": "Organik Pamuk",
                "Dolgu": "Doğal Latex"
            },
            "image_url": "https://images.unsplash.com/photo-1663811397302-8268848ca312?crop=entropy&cs=srgb&fm=jpg&q=85",
            "gallery": [
                "https://images.unsplash.com/photo-1663811397302-8268848ca312?crop=entropy&cs=srgb&fm=jpg&q=85"
            ],
            "is_featured": False,
            "order": 3,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Comfort Plus Yatak",
            "category": "yatak",
            "description": "Ekonomik fiyatıyla kaliteli uyku arayanlar için ideal seçim. Dayanıklı yapısı ve konforlu dolgusu ile uzun ömürlü kullanım.",
            "features": [
                "Ekonomik Fiyat",
                "Dayanıklı Yapı",
                "Kolay Bakım",
                "Parlak Kumaş",
                "5 Yıl Garanti"
            ],
            "specifications": {
                "Yükseklik": "25 cm",
                "Sertlik": "Sert",
                "Kumaş": "Jakarlı",
                "Dolgu": "Bonnel Yay + Sünger"
            },
            "image_url": "https://images.unsplash.com/photo-1742319096912-7bb94fdfeb03?crop=entropy&cs=srgb&fm=jpg&q=85",
            "gallery": [
                "https://images.unsplash.com/photo-1742319096912-7bb94fdfeb03?crop=entropy&cs=srgb&fm=jpg&q=85"
            ],
            "is_featured": False,
            "order": 4,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # BAZA Products
        {
            "id": str(uuid.uuid4()),
            "name": "Modern Sandıklı Baza",
            "category": "baza",
            "description": "Geniş depolama alanı ve şık tasarımıyla yatak odanıza modernlik katar. Hidrolik piston sistemi ile kolay açılır kapanır.",
            "features": [
                "Hidrolik Piston Sistemi",
                "Geniş Depolama Alanı",
                "Metal Çerçeve",
                "Su Geçirmez Kumaş",
                "10 Yıl Garanti"
            ],
            "specifications": {
                "Yükseklik": "45 cm",
                "Malzeme": "MDF + Metal",
                "Kumaş": "Kadife",
                "Depolama": "320 Litre"
            },
            "image_url": "https://images.unsplash.com/photo-1737467042207-7fc6318d3e5b?crop=entropy&cs=srgb&fm=jpg&q=85",
            "gallery": [
                "https://images.unsplash.com/photo-1737467042207-7fc6318d3e5b?crop=entropy&cs=srgb&fm=jpg&q=85",
                "https://images.unsplash.com/photo-1698517486200-e89403ea2738?crop=entropy&cs=srgb&fm=jpg&q=85"
            ],
            "is_featured": True,
            "order": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Başlıklı Premium Baza",
            "category": "baza",
            "description": "Entegre başlık tasarımı ile şık ve fonksiyonel. Yüksek kalite döşeme kumaşı ve sağlam yapısıyla yıllar boyu kullanım.",
            "features": [
                "Entegre Başlık",
                "Premium Döşeme",
                "Güçlendirilmiş Yapı",
                "Kolay Kurulum",
                "15 Yıl Garanti"
            ],
            "specifications": {
                "Yükseklik": "50 cm (Başlık dahil 120 cm)",
                "Malzeme": "Masif Ahşap + MDF",
                "Kumaş": "Şönil",
                "Başlık Tipi": "Kapitone"
            },
            "image_url": "https://images.unsplash.com/photo-1698517486200-e89403ea2738?crop=entropy&cs=srgb&fm=jpg&q=85",
            "gallery": [
                "https://images.unsplash.com/photo-1698517486200-e89403ea2738?crop=entropy&cs=srgb&fm=jpg&q=85"
            ],
            "is_featured": True,
            "order": 6,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Minimalist Baza",
            "category": "baza",
            "description": "Sade ve şık tasarımıyla modern yatak odaları için ideal. İnce profili ile mekanda ferahlık hissi yaratır.",
            "features": [
                "Minimalist Tasarım",
                "İnce Profil",
                "Güçlü Destek",
                "Kolay Temizlik",
                "8 Yıl Garanti"
            ],
            "specifications": {
                "Yükseklik": "35 cm",
                "Malzeme": "Metal Çerçeve",
                "Kumaş": "Microfiber",
                "Ayak": "Metal Silindir"
            },
            "image_url": "https://images.unsplash.com/photo-1769690399055-6cac5380d470?crop=entropy&cs=srgb&fm=jpg&q=85",
            "gallery": [
                "https://images.unsplash.com/photo-1769690399055-6cac5380d470?crop=entropy&cs=srgb&fm=jpg&q=85"
            ],
            "is_featured": False,
            "order": 7,
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
