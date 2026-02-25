import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Award } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const HomePage = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: t("guarantee"),
      description: t("guaranteeDesc"),
    },
    {
      icon: Zap,
      title: t("technology"),
      description: t("technologyDesc"),
    },
    {
      icon: Award,
      title: t("quality"),
      description: t("qualityDesc"),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div data-testid="home-page" className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://customer-assets.emergentagent.com/job_ibed-store/artifacts/634ni718_10.png')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/70 via-[#020617]/60 to-[#020617]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/80 via-transparent to-[#020617]/80" />
        </div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-32 pb-20 text-center"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-[#4ecdc4]/10 border border-[#4ecdc4]/30 text-[#4ecdc4] text-sm font-medium">
              {t("slogan")}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {t("heroTitle1")}
            <span className="block text-[#4ecdc4] text-glow">{t("heroTitle2")}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-10"
          >
            {t("heroDescription")}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/urunler"
              data-testid="hero-cta-products"
              className="btn-primary inline-flex items-center justify-center gap-2 group"
            >
              {t("exploreProducts")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              to="/iletisim"
              data-testid="hero-cta-contact"
              className="btn-secondary inline-flex items-center justify-center"
            >
              {t("contactUs")}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-[#4ecdc4]"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t("whyIbed")} <span className="text-[#4ecdc4]">İbed</span>?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              {t("heroDescription").slice(0, 50)}...
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="feature-card p-8 rounded-3xl bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/5 hover:border-[#4ecdc4]/30 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#4ecdc4]/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-[#4ecdc4]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-[#020617] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-[#4ecdc4]/5 to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              {t("ctaTitle1")} <span className="text-[#4ecdc4]">{t("ctaTitle2")}</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
              {t("ctaDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:03523211755"
                data-testid="cta-phone"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                0352 321 17 55
              </a>
              <Link
                to="/iletisim"
                data-testid="cta-contact"
                className="btn-secondary inline-flex items-center justify-center"
              >
                {t("formContact")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
