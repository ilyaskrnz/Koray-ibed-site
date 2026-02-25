from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
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

class LocalizedText(BaseModel):
    tr: str
    en: str
    ar: str

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: Dict[str, str]  # {"tr": "...", "en": "...", "ar": "..."}
    category: str  # "yatak" or "baza"
    description: Dict[str, str]
    features: Dict[str, List[str]]
    specifications: Dict[str, Dict[str, str]]
    image_url: str
    gallery: List[str] = []
    is_featured: bool = False
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
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

# ============ HELPER FUNCTIONS ============

def localize_product(product: dict, lang: str = "tr") -> dict:
    """Convert multilingual product to single language response"""
    if lang not in ["tr", "en", "ar"]:
        lang = "tr"
    
    return {
        "id": product.get("id"),
        "name": product.get("name", {}).get(lang, product.get("name", {}).get("tr", "")),
        "category": product.get("category"),
        "description": product.get("description", {}).get(lang, product.get("description", {}).get("tr", "")),
        "features": product.get("features", {}).get(lang, product.get("features", {}).get("tr", [])),
        "specifications": product.get("specifications", {}).get(lang, product.get("specifications", {}).get("tr", {})),
        "image_url": product.get("image_url"),
        "gallery": product.get("gallery", []),
        "is_featured": product.get("is_featured", False),
        "order": product.get("order", 0)
    }

# ============ ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "İbed API - Smart Bed, Smart Sleep"}

# Products
@api_router.get("/products")
async def get_products(
    category: Optional[str] = None, 
    featured: Optional[bool] = None,
    lang: str = Query(default="tr", description="Language: tr, en, ar")
):
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["is_featured"] = featured
    
    products = await db.products.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    
    # Localize products
    localized_products = [localize_product(p, lang) for p in products]
    return localized_products

@api_router.get("/products/{product_id}")
async def get_product(product_id: str, lang: str = Query(default="tr")):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    
    return localize_product(product, lang)

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

# Seed Products with multilingual support
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
            "name": {
                "tr": "İBED Royal Luxury Pocket",
                "en": "İBED Royal Luxury Pocket",
                "ar": "إيبد رويال لاكجري بوكيت"
            },
            "category": "yatak",
            "description": {
                "tr": "En üst segment yatak modelimiz. 7 katmanlı özel yapısı ile eşsiz konfor ve destek sağlar. Torba paket yay çekirdeği ile bağımsız destek teknolojisi sunar.",
                "en": "Our top segment mattress model. Provides unique comfort and support with its 7-layer special structure. Offers independent support technology with pocket spring core.",
                "ar": "موديل المرتبة الأعلى لدينا. يوفر راحة ودعم فريدين بهيكله الخاص المكون من 7 طبقات. يقدم تقنية الدعم المستقل مع نواة نوابض الجيب."
            },
            "features": {
                "tr": [
                    "Kapitone Katmanı (380gr Örme Kumaş + 400gr Deve/Koyun Yünü + 0.8cm Sünger)",
                    "2cm At Kılı",
                    "5cm Lateks",
                    "2cm 28dns Soft Sünger",
                    "2cm (1000gr) Hindistan Cevizi Lifi",
                    "1000gr Vatka",
                    "Torba Paket Yay Çekirdeği (Bağımsız Destek)"
                ],
                "en": [
                    "Quilted Layer (380gr Knitted Fabric + 400gr Camel/Sheep Wool + 0.8cm Foam)",
                    "2cm Horsehair",
                    "5cm Latex",
                    "2cm 28dns Soft Foam",
                    "2cm (1000gr) Coconut Fiber",
                    "1000gr Padding",
                    "Pocket Spring Core (Independent Support)"
                ],
                "ar": [
                    "طبقة مبطنة (380 جرام قماش محبوك + 400 جرام صوف جمل/غنم + 0.8 سم إسفنج)",
                    "2 سم شعر الخيل",
                    "5 سم لاتكس",
                    "2 سم إسفنج ناعم 28dns",
                    "2 سم (1000 جرام) ألياف جوز الهند",
                    "1000 جرام حشو",
                    "نواة نوابض الجيب (دعم مستقل)"
                ]
            },
            "specifications": {
                "tr": {
                    "Yükseklik": "35-38 cm",
                    "Yay Sistemi": "Torba Paket Yay",
                    "Kullanım": "Tek Yönlü",
                    "Kumaş": "380gr Örme Kumaş",
                    "Ölçüler": "90x190 cm / 150x200 cm"
                },
                "en": {
                    "Height": "35-38 cm",
                    "Spring System": "Pocket Spring",
                    "Usage": "Single-Sided",
                    "Fabric": "380gr Knitted Fabric",
                    "Dimensions": "90x190 cm / 150x200 cm"
                },
                "ar": {
                    "الارتفاع": "35-38 سم",
                    "نظام النوابض": "نوابض الجيب",
                    "الاستخدام": "جانب واحد",
                    "القماش": "380 جرام قماش محبوك",
                    "الأبعاد": "90x190 سم / 150x200 سم"
                }
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
            "name": {
                "tr": "İBED Luxury Pocket",
                "en": "İBED Luxury Pocket",
                "ar": "إيبد لاكجري بوكيت"
            },
            "category": "yatak",
            "description": {
                "tr": "Premium segment yatak modelimiz. 6 katmanlı yapısı ve çift yönlü kullanım özelliği ile uzun ömürlü konfor. Torba paket yay sistemi ile bağımsız destek sağlar.",
                "en": "Our premium segment mattress model. Long-lasting comfort with its 6-layer structure and dual-sided usage feature. Provides independent support with pocket spring system.",
                "ar": "موديل المرتبة المتميزة لدينا. راحة طويلة الأمد بهيكلها المكون من 6 طبقات وميزة الاستخدام المزدوج. يوفر دعمًا مستقلاً مع نظام نوابض الجيب."
            },
            "features": {
                "tr": [
                    "400gr Tavşantüyü Kumaş (Beyaz) + 300gr Elyaf + 1.5cm Sünger (Kapitone)",
                    "2cm Soft Sünger",
                    "2cm Sert Sünger",
                    "2cm Thermobont Vatka",
                    "Torba Paket Yay Çekirdeği (Bağımsız Destek)",
                    "Alt Taraf Simetrisi (Katmanlar 1-4 Tekrar)"
                ],
                "en": [
                    "400gr Rabbit Fur Fabric (White) + 300gr Fiber + 1.5cm Foam (Quilted)",
                    "2cm Soft Foam",
                    "2cm Hard Foam",
                    "2cm Thermobond Padding",
                    "Pocket Spring Core (Independent Support)",
                    "Bottom Side Symmetry (Layers 1-4 Repeat)"
                ],
                "ar": [
                    "400 جرام قماش فرو الأرنب (أبيض) + 300 جرام ألياف + 1.5 سم إسفنج (مبطن)",
                    "2 سم إسفنج ناعم",
                    "2 سم إسفنج صلب",
                    "2 سم حشو ثيرموبوند",
                    "نواة نوابض الجيب (دعم مستقل)",
                    "تماثل الجانب السفلي (تكرار الطبقات 1-4)"
                ]
            },
            "specifications": {
                "tr": {
                    "Yükseklik": "37-40 cm",
                    "Yay Sistemi": "Torba Paket Yay",
                    "Kullanım": "Çift Yönlü",
                    "Kumaş": "Tavşantüyü Örme Kumaş",
                    "Ölçüler": "90x190 cm / 150x200 cm"
                },
                "en": {
                    "Height": "37-40 cm",
                    "Spring System": "Pocket Spring",
                    "Usage": "Double-Sided",
                    "Fabric": "Rabbit Fur Knitted Fabric",
                    "Dimensions": "90x190 cm / 150x200 cm"
                },
                "ar": {
                    "الارتفاع": "37-40 سم",
                    "نظام النوابض": "نوابض الجيب",
                    "الاستخدام": "مزدوج الجانب",
                    "القماش": "قماش فرو الأرنب المحبوك",
                    "الأبعاد": "90x190 سم / 150x200 سم"
                }
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
            "name": {
                "tr": "İBED Titanium Support",
                "en": "İBED Titanium Support",
                "ar": "إيبد تيتانيوم سبورت"
            },
            "category": "yatak",
            "description": {
                "tr": "Sarsılmaz Destek, Modern Estetik. 7 katmanlı yapısı ve güçlendirilmiş Herkül yay sistemi ile ekstra dayanıklılık ve destek sunar. Çift yönlü kullanım özelliği.",
                "en": "Unshakeable Support, Modern Aesthetics. Offers extra durability and support with its 7-layer structure and reinforced Hercules spring system. Double-sided usage feature.",
                "ar": "دعم لا يتزعزع، جماليات حديثة. يوفر متانة ودعم إضافيين بهيكله المكون من 7 طبقات ونظام نوابض هرقل المعزز. ميزة الاستخدام المزدوج."
            },
            "features": {
                "tr": [
                    "240gr Örme Kumaş (Modern Desen)",
                    "300gr Elyaf + 1.5cm Soft Sünger (Kapitone)",
                    "2cm Soft Sünger",
                    "2cm Sert Sünger",
                    "1200gr Sert Keçe",
                    "Herkül Yay Çekirdeği (Bağlantılı Teller)",
                    "Alt Taraf Simetrisi"
                ],
                "en": [
                    "240gr Knitted Fabric (Modern Pattern)",
                    "300gr Fiber + 1.5cm Soft Foam (Quilted)",
                    "2cm Soft Foam",
                    "2cm Hard Foam",
                    "1200gr Hard Felt",
                    "Hercules Spring Core (Connected Wires)",
                    "Bottom Side Symmetry"
                ],
                "ar": [
                    "240 جرام قماش محبوك (نمط حديث)",
                    "300 جرام ألياف + 1.5 سم إسفنج ناعم (مبطن)",
                    "2 سم إسفنج ناعم",
                    "2 سم إسفنج صلب",
                    "1200 جرام لباد صلب",
                    "نواة نوابض هرقل (أسلاك متصلة)",
                    "تماثل الجانب السفلي"
                ]
            },
            "specifications": {
                "tr": {
                    "Yükseklik": "32-34 cm",
                    "Yay Sistemi": "Herkül Yay (Güçlendirilmiş)",
                    "Kullanım": "Çift Yönlü",
                    "Kumaş": "240gr Örme Kumaş",
                    "Ölçüler": "90x190 cm / 150x200 cm"
                },
                "en": {
                    "Height": "32-34 cm",
                    "Spring System": "Hercules Spring (Reinforced)",
                    "Usage": "Double-Sided",
                    "Fabric": "240gr Knitted Fabric",
                    "Dimensions": "90x190 cm / 150x200 cm"
                },
                "ar": {
                    "الارتفاع": "32-34 سم",
                    "نظام النوابض": "نوابض هرقل (معززة)",
                    "الاستخدام": "مزدوج الجانب",
                    "القماش": "240 جرام قماش محبوك",
                    "الأبعاد": "90x190 سم / 150x200 سم"
                }
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
            "name": {
                "tr": "İBED Classic Base",
                "en": "İBED Classic Base",
                "ar": "إيبد كلاسيك بيس"
            },
            "category": "yatak",
            "description": {
                "tr": "Klasik tasarım, güvenilir kalite. 6 katmanlı yapısı ve Herkül yay sistemi ile sağlam destek. Tek yönlü pedli kullanım özelliği. Bej keten yan bordür ile şık görünüm.",
                "en": "Classic design, reliable quality. Solid support with its 6-layer structure and Hercules spring system. Single-sided padded usage feature. Elegant look with beige linen side border.",
                "ar": "تصميم كلاسيكي، جودة موثوقة. دعم صلب بهيكلها المكون من 6 طبقات ونظام نوابض هرقل. ميزة الاستخدام المبطن من جانب واحد. مظهر أنيق مع حافة جانبية من الكتان البيج."
            },
            "features": {
                "tr": [
                    "240gr Örme Kumaş",
                    "300gr Elyaf + 0.8cm Sünger (Kapitone)",
                    "5cm Soft Sünger (Ped Bölgü)",
                    "2cm Sert Sünger",
                    "1200gr Keçe",
                    "Herkül Yay Çekirdeği (Bağlantılı Teller)"
                ],
                "en": [
                    "240gr Knitted Fabric",
                    "300gr Fiber + 0.8cm Foam (Quilted)",
                    "5cm Soft Foam (Pad Section)",
                    "2cm Hard Foam",
                    "1200gr Felt",
                    "Hercules Spring Core (Connected Wires)"
                ],
                "ar": [
                    "240 جرام قماش محبوك",
                    "300 جرام ألياف + 0.8 سم إسفنج (مبطن)",
                    "5 سم إسفنج ناعم (قسم البطانة)",
                    "2 سم إسفنج صلب",
                    "1200 جرام لباد",
                    "نواة نوابض هرقل (أسلاك متصلة)"
                ]
            },
            "specifications": {
                "tr": {
                    "Yükseklik": "32-34 cm",
                    "Yay Sistemi": "Herkül Yay",
                    "Kullanım": "Tek Yönlü (Pedli)",
                    "Kumaş": "240gr Örme Kumaş",
                    "Yan Bordür": "Bej Keten Kumaş",
                    "Ölçüler": "90x190 cm / 150x200 cm"
                },
                "en": {
                    "Height": "32-34 cm",
                    "Spring System": "Hercules Spring",
                    "Usage": "Single-Sided (Padded)",
                    "Fabric": "240gr Knitted Fabric",
                    "Side Border": "Beige Linen Fabric",
                    "Dimensions": "90x190 cm / 150x200 cm"
                },
                "ar": {
                    "الارتفاع": "32-34 سم",
                    "نظام النوابض": "نوابض هرقل",
                    "الاستخدام": "جانب واحد (مبطن)",
                    "القماش": "240 جرام قماش محبوك",
                    "الحافة الجانبية": "قماش كتان بيج",
                    "الأبعاد": "90x190 سم / 150x200 سم"
                }
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
            "name": {
                "tr": "İBED Classic Base Navy",
                "en": "İBED Classic Base Navy",
                "ar": "إيبد كلاسيك بيس نيفي"
            },
            "category": "yatak",
            "description": {
                "tr": "Klasik tasarım, modern estetik. 6 katmanlı yapısı ve Herkül yay sistemi ile sağlam destek. Lacivert kadife kumaş ile şık ve zarif görünüm.",
                "en": "Classic design, modern aesthetics. Solid support with its 6-layer structure and Hercules spring system. Elegant and refined look with navy velvet fabric.",
                "ar": "تصميم كلاسيكي، جماليات حديثة. دعم صلب بهيكلها المكون من 6 طبقات ونظام نوابض هرقل. مظهر أنيق وراقي مع قماش مخمل كحلي."
            },
            "features": {
                "tr": [
                    "240gr Örme Kumaş",
                    "300gr Elyaf + 0.8cm Sünger (Kapitone)",
                    "5cm Soft Sünger (Ped Bölgü)",
                    "2cm Sert Sünger",
                    "1200gr Keçe",
                    "Herkül Yay Çekirdeği (Bağlantılı Teller)"
                ],
                "en": [
                    "240gr Knitted Fabric",
                    "300gr Fiber + 0.8cm Foam (Quilted)",
                    "5cm Soft Foam (Pad Section)",
                    "2cm Hard Foam",
                    "1200gr Felt",
                    "Hercules Spring Core (Connected Wires)"
                ],
                "ar": [
                    "240 جرام قماش محبوك",
                    "300 جرام ألياف + 0.8 سم إسفنج (مبطن)",
                    "5 سم إسفنج ناعم (قسم البطانة)",
                    "2 سم إسفنج صلب",
                    "1200 جرام لباد",
                    "نواة نوابض هرقل (أسلاك متصلة)"
                ]
            },
            "specifications": {
                "tr": {
                    "Yükseklik": "32-34 cm",
                    "Yay Sistemi": "Herkül Yay",
                    "Kullanım": "Tek Yönlü (Pedli)",
                    "Kumaş": "240gr Örme Kumaş",
                    "Yan Bordür": "Lacivert Kadife Kumaş",
                    "Ölçüler": "90x190 cm / 150x200 cm"
                },
                "en": {
                    "Height": "32-34 cm",
                    "Spring System": "Hercules Spring",
                    "Usage": "Single-Sided (Padded)",
                    "Fabric": "240gr Knitted Fabric",
                    "Side Border": "Navy Velvet Fabric",
                    "Dimensions": "90x190 cm / 150x200 cm"
                },
                "ar": {
                    "الارتفاع": "32-34 سم",
                    "نظام النوابض": "نوابض هرقل",
                    "الاستخدام": "جانب واحد (مبطن)",
                    "القماش": "240 جرام قماش محبوك",
                    "الحافة الجانبية": "قماش مخمل كحلي",
                    "الأبعاد": "90x190 سم / 150x200 سم"
                }
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
            "name": {
                "tr": "İBED Pocket Lite",
                "en": "İBED Pocket Lite",
                "ar": "إيبد بوكيت لايت"
            },
            "category": "yatak",
            "description": {
                "tr": "Ekonomik fiyat, torba yay konforu. 7 katmanlı yapısı ve torba paket yay sistemi ile bütçe dostu premium deneyim. Çift yönlü kullanım ve Roll-Pack uygunluğu.",
                "en": "Economical price, pocket spring comfort. Budget-friendly premium experience with its 7-layer structure and pocket spring system. Double-sided usage and Roll-Pack compatible.",
                "ar": "سعر اقتصادي، راحة نوابض الجيب. تجربة متميزة صديقة للميزانية بهيكلها المكون من 7 طبقات ونظام نوابض الجيب. استخدام مزدوج الجانب ومتوافق مع رول-باك."
            },
            "features": {
                "tr": [
                    "180gr Örme Kumaş (Beyaz)",
                    "150gr Elyaf + 0.8cm Sünger (Kapitone)",
                    "2cm Soft Sünger",
                    "2cm Sert Sünger",
                    "1000gr Beyaz Keçe",
                    "Torba Paket Yay Çekirdeği",
                    "Alt Taraf Simetrisi"
                ],
                "en": [
                    "180gr Knitted Fabric (White)",
                    "150gr Fiber + 0.8cm Foam (Quilted)",
                    "2cm Soft Foam",
                    "2cm Hard Foam",
                    "1000gr White Felt",
                    "Pocket Spring Core",
                    "Bottom Side Symmetry"
                ],
                "ar": [
                    "180 جرام قماش محبوك (أبيض)",
                    "150 جرام ألياف + 0.8 سم إسفنج (مبطن)",
                    "2 سم إسفنج ناعم",
                    "2 سم إسفنج صلب",
                    "1000 جرام لباد أبيض",
                    "نواة نوابض الجيب",
                    "تماثل الجانب السفلي"
                ]
            },
            "specifications": {
                "tr": {
                    "Yükseklik": "28-30 cm",
                    "Yay Sistemi": "Torba Yay",
                    "Kullanım": "Çift Yönlü",
                    "Kumaş": "180gr Örme Kumaş",
                    "Roll-Pack": "Uygun",
                    "Ölçüler": "90x180 cm / 150x200 cm"
                },
                "en": {
                    "Height": "28-30 cm",
                    "Spring System": "Pocket Spring",
                    "Usage": "Double-Sided",
                    "Fabric": "180gr Knitted Fabric",
                    "Roll-Pack": "Compatible",
                    "Dimensions": "90x180 cm / 150x200 cm"
                },
                "ar": {
                    "الارتفاع": "28-30 سم",
                    "نظام النوابض": "نوابض الجيب",
                    "الاستخدام": "مزدوج الجانب",
                    "القماش": "180 جرام قماش محبوك",
                    "رول-باك": "متوافق",
                    "الأبعاد": "90x180 سم / 150x200 سم"
                }
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
            "name": {
                "tr": "İBED Smart Pocket",
                "en": "İBED Smart Pocket",
                "ar": "إيبد سمارت بوكيت"
            },
            "category": "yatak",
            "description": {
                "tr": "Akıllı tasarım, akıllı uyku. 6 katmanlı yapısı ve torba yay sistemi ile uygun fiyatlı premium konfor. Çift yönlü kullanım ve Roll-Pack uygunluğu.",
                "en": "Smart design, smart sleep. Affordable premium comfort with its 6-layer structure and pocket spring system. Double-sided usage and Roll-Pack compatible.",
                "ar": "تصميم ذكي، نوم ذكي. راحة متميزة بأسعار معقولة بهيكلها المكون من 6 طبقات ونظام نوابض الجيب. استخدام مزدوج الجانب ومتوافق مع رول-باك."
            },
            "features": {
                "tr": [
                    "180gr Örme Kumaş (Beyaz)",
                    "90gr Elyaf + 0.8cm Sünger (Kapitone)",
                    "2cm Soft Sünger",
                    "1000gr Keçe",
                    "Torba Paket Yay Çekirdeği",
                    "Alt Taraf Simetrisi"
                ],
                "en": [
                    "180gr Knitted Fabric (White)",
                    "90gr Fiber + 0.8cm Foam (Quilted)",
                    "2cm Soft Foam",
                    "1000gr Felt",
                    "Pocket Spring Core",
                    "Bottom Side Symmetry"
                ],
                "ar": [
                    "180 جرام قماش محبوك (أبيض)",
                    "90 جرام ألياف + 0.8 سم إسفنج (مبطن)",
                    "2 سم إسفنج ناعم",
                    "1000 جرام لباد",
                    "نواة نوابض الجيب",
                    "تماثل الجانب السفلي"
                ]
            },
            "specifications": {
                "tr": {
                    "Yükseklik": "25 cm",
                    "Yay Sistemi": "Torba Yay",
                    "Kullanım": "Çift Yönlü",
                    "Kumaş": "180gr Örme Kumaş",
                    "Roll-Pack": "Uygun",
                    "Ölçüler": "90x150 cm / 150x200 cm"
                },
                "en": {
                    "Height": "25 cm",
                    "Spring System": "Pocket Spring",
                    "Usage": "Double-Sided",
                    "Fabric": "180gr Knitted Fabric",
                    "Roll-Pack": "Compatible",
                    "Dimensions": "90x150 cm / 150x200 cm"
                },
                "ar": {
                    "الارتفاع": "25 سم",
                    "نظام النوابض": "نوابض الجيب",
                    "الاستخدام": "مزدوج الجانب",
                    "القماش": "180 جرام قماش محبوك",
                    "رول-باك": "متوافق",
                    "الأبعاد": "90x150 سم / 150x200 سم"
                }
            },
            "image_url": "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/m30kjnyn_16.png",
            "gallery": [
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/m30kjnyn_16.png",
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/aiw38sv7_14.png",
                "https://customer-assets.emergentagent.com/job_ibed-store/artifacts/mn9uyaok_15.png"
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
