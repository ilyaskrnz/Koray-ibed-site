import { motion } from "framer-motion";
import { Award, Users, Factory, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const AboutPage = () => {
  const { t } = useLanguage();

  const stats = [
    { number: "20+", label: t("yearsExperience") },
    { number: "50K+", label: t("happyCustomers") },
    { number: "100+", label: t("dealerNetwork") },
  ];

  const values = [
    {
      icon: Award,
      title: t("qualityValue"),
      description: t("qualityValueDesc"),
    },
    {
      icon: Users,
      title: t("customerFocus"),
      description: t("customerFocusDesc"),
    },
    {
      icon: Factory,
      title: t("localProduction"),
      description: t("localProductionDesc"),
    },
    {
      icon: Shield,
      title: t("reliability"),
      description: t("reliabilityDesc"),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div data-testid="about-page" className="min-h-screen pt-24 sm:pt-28 pb-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#4ecdc4]/10 border border-[#4ecdc4]/30 text-[#4ecdc4] text-sm font-medium mb-6">
            {t("aboutUs")}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t("aboutTitle1")}
            <span className="block text-[#4ecdc4]">{t("aboutTitle2")}</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            {t("aboutDescription")}
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#0f172a]/50 py-20 mb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                data-testid={`stat-${index}`}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold text-[#4ecdc4] mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              {t("ourStory")}
            </h2>
            <div className="space-y-4 text-slate-400">
              <p>{t("storyP1")}</p>
              <p>{t("storyP2")}</p>
              <p>{t("storyP3")}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="https://customer-assets.emergentagent.com/job_ibed-store/artifacts/ud9rmqex_11.png"
                alt="İbed"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 rtl:-right-6 rtl:left-auto w-48 h-48 rounded-2xl overflow-hidden border-4 border-[#020617] hidden lg:block">
              <img
                src="https://customer-assets.emergentagent.com/job_ibed-store/artifacts/rfp4t1a3_12.png"
                alt="İbed Detay"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t("ourValues")}
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            {t("valuesDescription")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              data-testid={`value-${index}`}
              className="p-6 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/5 hover:border-[#4ecdc4]/30 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-[#4ecdc4]/10 flex items-center justify-center mb-4">
                <value.icon className="w-6 h-6 text-[#4ecdc4]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
              <p className="text-slate-400 text-sm">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-12 rounded-3xl bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/5 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {t("meetYou")}
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            {t("meetYouDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/iletisim"
              data-testid="about-cta-contact"
              className="btn-primary inline-flex items-center justify-center"
            >
              {t("contactUs")}
            </Link>
            <Link
              to="/urunler"
              data-testid="about-cta-products"
              className="btn-secondary inline-flex items-center justify-center"
            >
              {t("viewProducts")}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
