import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: t("home"), path: "/" },
    { name: t("products"), path: "/urunler" },
    { name: t("about"), path: "/hakkimizda" },
    { name: t("contact"), path: "/iletisim" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      data-testid="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 rounded-full transition-all duration-500 ${
        scrolled
          ? "bg-[#020617]/95 backdrop-blur-xl shadow-2xl border border-white/10"
          : "bg-[#0f172a]/80 backdrop-blur-lg border border-white/5"
      }`}
    >
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" data-testid="navbar-logo" className="flex items-center gap-2">
          <img
            src="https://customer-assets.emergentagent.com/job_ibed-store/artifacts/8a77bb1w_WhatsApp%20Image%202026-02-22%20at%2014.44.57.jpeg"
            alt="İbed Logo"
            className="h-10 w-auto rounded-lg"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              data-testid={`nav-link-${link.path.replace("/", "") || "home"}`}
              className={`text-sm font-medium transition-colors duration-300 relative ${
                isActive(link.path)
                  ? "text-[#4ecdc4]"
                  : "text-slate-300 hover:text-[#4ecdc4]"
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#4ecdc4] rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <a
            href="tel:03523211755"
            data-testid="navbar-phone"
            className="flex items-center gap-2 text-sm font-medium text-[#4ecdc4] hover:text-[#2dd4bf] transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>0352 321 17 55</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          data-testid="mobile-menu-button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white hover:text-[#4ecdc4] transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    data-testid={`mobile-nav-link-${link.path.replace("/", "") || "home"}`}
                    className={`block py-2 text-lg font-medium transition-colors ${
                      isActive(link.path)
                        ? "text-[#4ecdc4]"
                        : "text-slate-300 hover:text-[#4ecdc4]"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4 border-t border-white/10 flex items-center justify-between"
              >
                <a
                  href="tel:03523211755"
                  className="flex items-center gap-2 text-[#4ecdc4]"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">0352 321 17 55</span>
                </a>
                <LanguageSwitcher />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
