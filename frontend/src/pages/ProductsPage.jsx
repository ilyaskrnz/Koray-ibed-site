import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("kategori") || "all";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryParam = activeCategory !== "all" ? `?category=${activeCategory}` : "";
        const response = await axios.get(`${API}/products${categoryParam}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ kategori: category });
    }
  };

  const categories = [
    { id: "all", name: "Tümü" },
    { id: "yatak", name: "Yatak" },
    { id: "baza", name: "Baza" },
  ];

  return (
    <div data-testid="products-page" className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Ürünlerimiz
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Kaliteli uyku için tasarlanmış yatak ve baza koleksiyonumuz
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              data-testid={`category-${category.id}`}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-[#4ecdc4] text-[#020617]"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-product animate-pulse">
                <div className="aspect-[4/3] skeleton" />
                <div className="p-6">
                  <div className="h-4 skeleton rounded w-1/4 mb-3" />
                  <div className="h-6 skeleton rounded mb-3" />
                  <div className="h-4 skeleton rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-slate-400 text-lg">Bu kategoride ürün bulunamadı.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={`/urunler/${product.id}`}
                  data-testid={`product-card-${index}`}
                  className="product-card card-product block group"
                >
                  <div className="aspect-square overflow-hidden relative bg-[#0f172a]">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="product-card-image w-full h-full object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4ecdc4] text-[#020617] text-sm font-medium">
                        Detaylar
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-xs text-[#4ecdc4] uppercase tracking-wider mb-2 block">
                      {product.category === "yatak" ? "Yatak" : "Baza"}
                    </span>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#4ecdc4] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
