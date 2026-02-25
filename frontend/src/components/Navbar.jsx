import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const languages = [
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();

  const currentLang = languages.find((l) => l.code === language);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setLangOpen(false);
  }, [location]);

  // Close lang dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-lang-dropdown]')) {
        setLangOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#020617]/95 backdrop-blur-xl shadow-2xl border-b border-white/10"
          : "bg-[#0f172a]/90 backdrop-blur-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" data-testid="navbar-logo" className="flex-shrink-0">
            <img
              src="https://customer-assets.emergentagent.com/job_ibed-store/artifacts/8a77bb1w_WhatsApp%20Image%202026-02-22%20at%2014.44.57.jpeg"
              alt="İbed Logo"
              className="h-10 sm:h-12 w-auto rounded-lg"
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-8">
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

          {/* Right Side - Language & Phone & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <div className="relative" data-lang-dropdown>
              <button
                data-testid="language-switcher"
                onClick={(e) => {
                  e.stopPropagation();
                  setLangOpen(!langOpen);
                }}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Globe className="w-4 h-4 text-[#4ecdc4]" />
                <span className="text-sm text-white hidden sm:inline">{currentLang?.flag}</span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform ${
                    langOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Language Dropdown */}
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 right-0 min-w-[140px] bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        data-testid={`lang-${lang.code}`}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          language === lang.code
                            ? "bg-[#4ecdc4]/10 text-[#4ecdc4]"
                            : "text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Phone - Desktop only */}
            <a
              href="tel:03523211755"
              data-testid="navbar-phone"
              className="hidden lg:flex items-center gap-2 text-sm font-medium text-[#4ecdc4] hover:text-[#2dd4bf] transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>0352 321 17 55</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              data-testid="mobile-menu-button"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-white hover:text-[#4ecdc4] transition-colors rounded-lg hover:bg-white/5"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
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
                    className={`block py-3 text-lg font-medium transition-colors ${
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
                className="pt-4 border-t border-white/10"
              >
                <a
                  href="tel:03523211755"
                  className="flex items-center gap-2 text-[#4ecdc4] text-lg"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">0352 321 17 55</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
