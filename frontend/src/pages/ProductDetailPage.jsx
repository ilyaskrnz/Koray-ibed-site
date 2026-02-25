import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API}/products/${id}?lang=${language}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, language]);

  if (loading) {
    return (
      <div data-testid="product-detail-loading" className="min-h-screen pt-24 sm:pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square skeleton rounded-2xl" />
            <div className="space-y-6">
              <div className="h-8 skeleton rounded w-1/4" />
              <div className="h-12 skeleton rounded w-3/4" />
              <div className="h-24 skeleton rounded" />
              <div className="h-48 skeleton rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div data-testid="product-not-found" className="min-h-screen pt-24 sm:pt-28 pb-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t("productNotFound")}</h2>
          <Link to="/urunler" className="text-[#4ecdc4] hover:underline">
            {t("backToProducts")}
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [product.image_url, ...(product.gallery || [])].filter(
    (img, index, arr) => arr.indexOf(img) === index
  );

  return (
    <div data-testid="product-detail-page" className="min-h-screen pt-24 sm:pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/urunler"
            data-testid="back-to-products"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-[#4ecdc4] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            <span>{t("backToProducts")}</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#0f172a]">
              <img
                src={allImages[selectedImage]}
                alt={product.name}
                data-testid="product-main-image"
                className="w-full h-full object-contain p-4"
              />
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 horizontal-scroll">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    data-testid={`product-thumbnail-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#4ecdc4]"
                        : "border-transparent hover:border-white/20"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Category & Title */}
            <div>
              <span className="text-sm text-[#4ecdc4] uppercase tracking-wider mb-2 block">
                {product.category === "yatak" ? t("mattress") : t("base")}
              </span>
              <h1 data-testid="product-title" className="text-3xl sm:text-4xl font-bold text-white">
                {product.name}
              </h1>
            </div>

            {/* Description */}
            <p data-testid="product-description" className="text-slate-400 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">{t("features")}</h3>
              <ul className="space-y-3">
                {product.features?.map((feature, index) => (
                  <li
                    key={index}
                    data-testid={`product-feature-${index}`}
                    className="flex items-start gap-3 text-slate-300"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#4ecdc4]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#4ecdc4]" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">{t("specifications")}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <div
                      key={index}
                      data-testid={`product-spec-${index}`}
                      className="p-4 rounded-xl bg-[#0f172a]/50 border border-white/5"
                    >
                      <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">
                        {key}
                      </span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-slate-400 mb-4">
                {t("contactForInfo")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:03523211755"
                  data-testid="product-call-button"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  {t("callNow")}
                </a>
                <Link
                  to="/iletisim"
                  data-testid="product-contact-button"
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  {t("formContact")}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
