import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  tr: {
    // Navbar
    home: "Ana Sayfa",
    products: "Ürünler",
    about: "Hakkımızda",
    contact: "İletişim",
    
    // Hero
    slogan: "smart bed, smart sleep",
    heroTitle1: "Hayalinizdeki",
    heroTitle2: "Uyku Deneyimi",
    heroDescription: "İbed ile kaliteli uykunun keyfini çıkarın. Yenilikçi teknolojiler ve üstün malzeme kalitesiyle üretilen yatak ve bazalarımız, size hak ettiğiniz dinlenmeyi sunar.",
    exploreProducts: "Ürünleri Keşfet",
    contactUs: "İletişime Geç",
    
    // Features
    whyIbed: "Neden",
    guarantee: "Garanti",
    guaranteeDesc: "20 yıla kadar garanti ile güvenli alışveriş",
    technology: "Teknoloji",
    technologyDesc: "En son uyku teknolojileri ile üretim",
    quality: "Kalite",
    qualityDesc: "Premium malzemeler ve işçilik",
    
    // CTA
    ctaTitle1: "Kaliteli Uykunun",
    ctaTitle2: "Adresi",
    ctaDescription: "Size en uygun yatak ve baza modellerini keşfetmek için hemen iletişime geçin. Uzman ekibimiz size yardımcı olmaktan mutluluk duyacaktır.",
    formContact: "Form ile İletişim",
    
    // Products Page
    ourProducts: "Ürünlerimiz",
    productsDescription: "Kaliteli uyku için tasarlanmış yatak ve baza koleksiyonumuz",
    all: "Tümü",
    mattress: "Yatak",
    base: "Baza",
    details: "Detaylar",
    noProducts: "Bu kategoride ürün bulunamadı.",
    
    // Product Detail
    backToProducts: "Ürünlere Dön",
    features: "Özellikler",
    specifications: "Teknik Özellikler",
    productNotFound: "Ürün Bulunamadı",
    contactForInfo: "Bu ürün hakkında detaylı bilgi almak için bizimle iletişime geçin.",
    callNow: "Hemen Ara",
    
    // About Page
    aboutUs: "Hakkımızda",
    aboutTitle1: "Kaliteli Uykunun",
    aboutTitle2: "Kayseri'den Yükselen Adresi",
    aboutDescription: "İbed olarak, uyku sağlığının önemini biliyor ve her bireye hak ettiği kaliteli uyku deneyimini sunmak için çalışıyoruz. Modern tesislerimizde, en son teknoloji ve premium malzemelerle ürettiğimiz yatak ve bazalarımızla hayatınıza konfor katıyoruz.",
    yearsExperience: "Yıllık Deneyim",
    happyCustomers: "Mutlu Müşteri",
    dealerNetwork: "Bayi Ağı",
    yearsWarranty: "Yıl Garanti",
    ourStory: "Hikayemiz",
    storyP1: "İbed, Kayseri'nin köklü mobilya üretim geleneğini modern teknolojiyle buluşturma vizyonuyla kuruldu. Yılların tecrübesi ve yenilikçi yaklaşımımızla, Türkiye'nin önde gelen yatak üreticilerinden biri haline geldik.",
    storyP2: "\"Smart bed, smart sleep\" felsefemizle, sadece bir yatak değil, kaliteli bir uyku deneyimi sunuyoruz. Her ürünümüz, ergonomik tasarım, üstün malzeme kalitesi ve titiz işçilik anlayışıyla üretiliyor.",
    storyP3: "Bugün, Kayseri Organize Sanayi Bölgesi'ndeki modern tesislerimizde, uzman kadromuzla her gün daha iyi ürünler üretmek için çalışıyoruz.",
    ourValues: "Değerlerimiz",
    valuesDescription: "İbed'i İbed yapan temel değerlerimiz",
    qualityValue: "Kalite",
    qualityValueDesc: "Premium malzemeler ve titiz işçilik ile en yüksek kalite standartlarında üretim yapıyoruz.",
    customerFocus: "Müşteri Odaklılık",
    customerFocusDesc: "Müşterilerimizin ihtiyaçlarını anlamak ve en iyi uyku deneyimini sunmak önceliğimizdir.",
    localProduction: "Yerli Üretim",
    localProductionDesc: "Kayseri'deki modern tesislerimizde, yerli ve milli üretim yapmanın gururunu yaşıyoruz.",
    reliability: "Güvenilirlik",
    reliabilityDesc: "20 yıla kadar garanti ile ürünlerimizin arkasında duruyoruz.",
    meetYou: "Sizinle Tanışmak İsteriz",
    meetYouDesc: "Ürünlerimiz hakkında detaylı bilgi almak veya bayilik başvurusu yapmak için bizimle iletişime geçin.",
    viewProducts: "Ürünleri İncele",
    
    // Contact Page
    contactTitle: "Bizimle İletişime Geçin",
    contactDescription: "Sorularınız, önerileriniz veya bayilik başvurularınız için bize ulaşın.",
    phone: "Telefon",
    email: "E-posta",
    address: "Adres",
    addressValue: "Kayseri OSB 23. Cad. No:19 Melikgazi/Kayseri",
    yourName: "Adınız Soyadınız",
    yourEmail: "E-posta",
    yourPhone: "Telefon",
    subject: "Konu",
    message: "Mesajınız",
    sendMessage: "Mesaj Gönder",
    sending: "Gönderiliyor...",
    messageReceived: "Mesajınız Alındı!",
    willContact: "En kısa sürede sizinle iletişime geçeceğiz.",
    sendAnother: "Yeni Mesaj Gönder",
    messageSent: "Mesajınız başarıyla gönderildi!",
    messageError: "Mesaj gönderilirken bir hata oluştu.",
    
    // Footer
    footerDescription: "İbed olarak, kaliteli uykunun önemini biliyoruz. Yıllarca süren deneyim ve teknolojik yeniliklerle, size en iyi uyku deneyimini sunmak için çalışıyoruz.",
    quickLinks: "Hızlı Linkler",
    allRightsReserved: "Tüm hakları saklıdır.",
    madeInKayseri: "Kayseri'de tasarlandı ve üretildi.",
    
    // Product specifications
    height: "Yükseklik",
    springSystem: "Yay Sistemi",
    usage: "Kullanım",
    fabric: "Kumaş",
    sideBorder: "Yan Bordür",
    dimensions: "Ölçüler",
    rollPack: "Roll-Pack"
  },
  en: {
    // Navbar
    home: "Home",
    products: "Products",
    about: "About Us",
    contact: "Contact",
    
    // Hero
    slogan: "smart bed, smart sleep",
    heroTitle1: "Your Dream",
    heroTitle2: "Sleep Experience",
    heroDescription: "Enjoy quality sleep with İbed. Our mattresses and bed bases, produced with innovative technologies and superior material quality, offer you the rest you deserve.",
    exploreProducts: "Explore Products",
    contactUs: "Contact Us",
    
    // Features
    whyIbed: "Why",
    guarantee: "Warranty",
    guaranteeDesc: "Safe shopping with up to 20 years warranty",
    technology: "Technology",
    technologyDesc: "Production with the latest sleep technologies",
    quality: "Quality",
    qualityDesc: "Premium materials and craftsmanship",
    
    // CTA
    ctaTitle1: "The Address of",
    ctaTitle2: "Quality Sleep",
    ctaDescription: "Contact us now to discover the most suitable mattress and bed base models for you. Our expert team will be happy to help you.",
    formContact: "Contact via Form",
    
    // Products Page
    ourProducts: "Our Products",
    productsDescription: "Our mattress and bed base collection designed for quality sleep",
    all: "All",
    mattress: "Mattress",
    base: "Bed Base",
    details: "Details",
    noProducts: "No products found in this category.",
    
    // Product Detail
    backToProducts: "Back to Products",
    features: "Features",
    specifications: "Technical Specifications",
    productNotFound: "Product Not Found",
    contactForInfo: "Contact us for detailed information about this product.",
    callNow: "Call Now",
    
    // About Page
    aboutUs: "About Us",
    aboutTitle1: "The Rising Address of",
    aboutTitle2: "Quality Sleep from Kayseri",
    aboutDescription: "At İbed, we understand the importance of sleep health and work to provide every individual with the quality sleep experience they deserve. We add comfort to your life with our mattresses and bed bases produced with the latest technology and premium materials in our modern facilities.",
    yearsExperience: "Years Experience",
    happyCustomers: "Happy Customers",
    dealerNetwork: "Dealer Network",
    yearsWarranty: "Years Warranty",
    ourStory: "Our Story",
    storyP1: "İbed was founded with the vision of combining Kayseri's deep-rooted furniture production tradition with modern technology. With years of experience and our innovative approach, we have become one of Turkey's leading mattress manufacturers.",
    storyP2: "With our \"Smart bed, smart sleep\" philosophy, we offer not just a mattress, but a quality sleep experience. Each of our products is manufactured with ergonomic design, superior material quality and meticulous craftsmanship.",
    storyP3: "Today, we work every day to produce better products with our expert team at our modern facilities in Kayseri Organized Industrial Zone.",
    ourValues: "Our Values",
    valuesDescription: "The core values that make İbed, İbed",
    qualityValue: "Quality",
    qualityValueDesc: "We produce at the highest quality standards with premium materials and meticulous craftsmanship.",
    customerFocus: "Customer Focus",
    customerFocusDesc: "Understanding our customers' needs and providing the best sleep experience is our priority.",
    localProduction: "Local Production",
    localProductionDesc: "We are proud to produce locally and nationally at our modern facilities in Kayseri.",
    reliability: "Reliability",
    reliabilityDesc: "We stand behind our products with up to 20 years warranty.",
    meetYou: "We Want to Meet You",
    meetYouDesc: "Contact us to get detailed information about our products or to apply for dealership.",
    viewProducts: "View Products",
    
    // Contact Page
    contactTitle: "Contact Us",
    contactDescription: "Reach out to us for your questions, suggestions or dealership applications.",
    phone: "Phone",
    email: "Email",
    address: "Address",
    addressValue: "Kayseri OIZ 23rd St. No:19 Melikgazi/Kayseri, Turkey",
    yourName: "Your Name",
    yourEmail: "Email",
    yourPhone: "Phone",
    subject: "Subject",
    message: "Your Message",
    sendMessage: "Send Message",
    sending: "Sending...",
    messageReceived: "Message Received!",
    willContact: "We will contact you as soon as possible.",
    sendAnother: "Send New Message",
    messageSent: "Your message has been sent successfully!",
    messageError: "An error occurred while sending the message.",
    
    // Footer
    footerDescription: "At İbed, we know the importance of quality sleep. With years of experience and technological innovations, we work to provide you with the best sleep experience.",
    quickLinks: "Quick Links",
    allRightsReserved: "All rights reserved.",
    madeInKayseri: "Designed and manufactured in Kayseri.",
    
    // Product specifications
    height: "Height",
    springSystem: "Spring System",
    usage: "Usage",
    fabric: "Fabric",
    sideBorder: "Side Border",
    dimensions: "Dimensions",
    rollPack: "Roll-Pack"
  },
  ar: {
    // Navbar
    home: "الرئيسية",
    products: "المنتجات",
    about: "من نحن",
    contact: "اتصل بنا",
    
    // Hero
    slogan: "سرير ذكي، نوم ذكي",
    heroTitle1: "تجربة النوم",
    heroTitle2: "التي تحلم بها",
    heroDescription: "استمتع بنوم عالي الجودة مع إيبد. مراتبنا وقواعد الأسرة المصنعة بتقنيات مبتكرة وجودة مواد فائقة تقدم لك الراحة التي تستحقها.",
    exploreProducts: "استكشف المنتجات",
    contactUs: "تواصل معنا",
    
    // Features
    whyIbed: "لماذا",
    guarantee: "الضمان",
    guaranteeDesc: "تسوق آمن مع ضمان يصل إلى 20 عامًا",
    technology: "التكنولوجيا",
    technologyDesc: "إنتاج بأحدث تقنيات النوم",
    quality: "الجودة",
    qualityDesc: "مواد فاخرة وحرفية عالية",
    
    // CTA
    ctaTitle1: "عنوان",
    ctaTitle2: "النوم الجيد",
    ctaDescription: "تواصل معنا الآن لاكتشاف أنسب موديلات المراتب وقواعد الأسرة لك. سيسعد فريقنا المتخصص بمساعدتك.",
    formContact: "تواصل عبر النموذج",
    
    // Products Page
    ourProducts: "منتجاتنا",
    productsDescription: "مجموعتنا من المراتب وقواعد الأسرة المصممة للنوم الجيد",
    all: "الكل",
    mattress: "مرتبة",
    base: "قاعدة سرير",
    details: "التفاصيل",
    noProducts: "لم يتم العثور على منتجات في هذه الفئة.",
    
    // Product Detail
    backToProducts: "العودة للمنتجات",
    features: "المميزات",
    specifications: "المواصفات الفنية",
    productNotFound: "المنتج غير موجود",
    contactForInfo: "تواصل معنا للحصول على معلومات تفصيلية حول هذا المنتج.",
    callNow: "اتصل الآن",
    
    // About Page
    aboutUs: "من نحن",
    aboutTitle1: "عنوان النوم الجيد",
    aboutTitle2: "الصاعد من قيصري",
    aboutDescription: "في إيبد، نفهم أهمية صحة النوم ونعمل على تقديم تجربة نوم عالية الجودة يستحقها كل فرد. نضيف الراحة إلى حياتك بمراتبنا وقواعد الأسرة المنتجة بأحدث التقنيات والمواد الفاخرة في منشآتنا الحديثة.",
    yearsExperience: "سنوات الخبرة",
    happyCustomers: "عملاء سعداء",
    dealerNetwork: "شبكة الوكلاء",
    yearsWarranty: "سنوات الضمان",
    ourStory: "قصتنا",
    storyP1: "تأسست إيبد برؤية الجمع بين تراث قيصري العريق في صناعة الأثاث والتكنولوجيا الحديثة. بسنوات من الخبرة ونهجنا المبتكر، أصبحنا أحد أبرز مصنعي المراتب في تركيا.",
    storyP2: "مع فلسفتنا \"سرير ذكي، نوم ذكي\"، نقدم ليس مجرد مرتبة، بل تجربة نوم عالية الجودة. يتم تصنيع كل منتج من منتجاتنا بتصميم مريح وجودة مواد فائقة وحرفية دقيقة.",
    storyP3: "اليوم، نعمل كل يوم لإنتاج منتجات أفضل مع فريقنا المتخصص في منشآتنا الحديثة في منطقة قيصري الصناعية المنظمة.",
    ourValues: "قيمنا",
    valuesDescription: "القيم الأساسية التي تجعل إيبد، إيبد",
    qualityValue: "الجودة",
    qualityValueDesc: "ننتج بأعلى معايير الجودة بمواد فاخرة وحرفية دقيقة.",
    customerFocus: "التركيز على العملاء",
    customerFocusDesc: "فهم احتياجات عملائنا وتقديم أفضل تجربة نوم هو أولويتنا.",
    localProduction: "الإنتاج المحلي",
    localProductionDesc: "نفخر بالإنتاج المحلي والوطني في منشآتنا الحديثة في قيصري.",
    reliability: "الموثوقية",
    reliabilityDesc: "نقف وراء منتجاتنا بضمان يصل إلى 20 عامًا.",
    meetYou: "نريد أن نلتقي بك",
    meetYouDesc: "تواصل معنا للحصول على معلومات تفصيلية حول منتجاتنا أو للتقدم للوكالة.",
    viewProducts: "عرض المنتجات",
    
    // Contact Page
    contactTitle: "تواصل معنا",
    contactDescription: "تواصل معنا لاستفساراتك أو اقتراحاتك أو طلبات الوكالة.",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    address: "العنوان",
    addressValue: "قيصري المنطقة الصناعية المنظمة، الشارع 23، رقم 19، ميليكغازي/قيصري، تركيا",
    yourName: "اسمك الكامل",
    yourEmail: "البريد الإلكتروني",
    yourPhone: "الهاتف",
    subject: "الموضوع",
    message: "رسالتك",
    sendMessage: "إرسال الرسالة",
    sending: "جاري الإرسال...",
    messageReceived: "تم استلام رسالتك!",
    willContact: "سنتواصل معك في أقرب وقت ممكن.",
    sendAnother: "إرسال رسالة جديدة",
    messageSent: "تم إرسال رسالتك بنجاح!",
    messageError: "حدث خطأ أثناء إرسال الرسالة.",
    
    // Footer
    footerDescription: "في إيبد، نعرف أهمية النوم الجيد. مع سنوات من الخبرة والابتكارات التكنولوجية، نعمل على تقديم أفضل تجربة نوم لك.",
    quickLinks: "روابط سريعة",
    allRightsReserved: "جميع الحقوق محفوظة.",
    madeInKayseri: "صُمم وصُنع في قيصري.",
    
    // Product specifications
    height: "الارتفاع",
    springSystem: "نظام النوابض",
    usage: "الاستخدام",
    fabric: "القماش",
    sideBorder: "الحافة الجانبية",
    dimensions: "الأبعاد",
    rollPack: "رول-باك"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("ibed-language");
    return saved || "tr";
  });

  useEffect(() => {
    localStorage.setItem("ibed-language", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
