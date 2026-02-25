import { motion } from "framer-motion";
import { Award, Users, Factory, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const stats = [
    { number: "20+", label: "Yıllık Deneyim" },
    { number: "50K+", label: "Mutlu Müşteri" },
    { number: "100+", label: "Bayi Ağı" },
    { number: "20", label: "Yıl Garanti" },
  ];

  const values = [
    {
      icon: Award,
      title: "Kalite",
      description:
        "Premium malzemeler ve titiz işçilik ile en yüksek kalite standartlarında üretim yapıyoruz.",
    },
    {
      icon: Users,
      title: "Müşteri Odaklılık",
      description:
        "Müşterilerimizin ihtiyaçlarını anlamak ve en iyi uyku deneyimini sunmak önceliğimizdir.",
    },
    {
      icon: Factory,
      title: "Yerli Üretim",
      description:
        "Kayseri'deki modern tesislerimizde, yerli ve milli üretim yapmanın gururunu yaşıyoruz.",
    },
    {
      icon: Shield,
      title: "Güvenilirlik",
      description:
        "20 yıla kadar garanti ile ürünlerimizin arkasında duruyoruz.",
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
    <div data-testid="about-page" className="min-h-screen pt-32 pb-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#4ecdc4]/10 border border-[#4ecdc4]/30 text-[#4ecdc4] text-sm font-medium mb-6">
            Hakkımızda
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Kaliteli Uykunun
            <span className="block text-[#4ecdc4]">Kayseri'den Yükselen Adresi</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            İbed olarak, uyku sağlığının önemini biliyor ve her bireye hak ettiği 
            kaliteli uyku deneyimini sunmak için çalışıyoruz. Modern tesislerimizde, 
            en son teknoloji ve premium malzemelerle ürettiğimiz yatak ve bazalarımızla 
            hayatınıza konfor katıyoruz.
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
              Hikayemiz
            </h2>
            <div className="space-y-4 text-slate-400">
              <p>
                İbed, Kayseri'nin köklü mobilya üretim geleneğini modern teknolojiyle 
                buluşturma vizyonuyla kuruldu. Yılların tecrübesi ve yenilikçi 
                yaklaşımımızla, Türkiye'nin önde gelen yatak üreticilerinden biri haline geldik.
              </p>
              <p>
                "Smart bed, smart sleep" felsefemizle, sadece bir yatak değil, 
                kaliteli bir uyku deneyimi sunuyoruz. Her ürünümüz, ergonomik tasarım, 
                üstün malzeme kalitesi ve titiz işçilik anlayışıyla üretiliyor.
              </p>
              <p>
                Bugün, Kayseri Organize Sanayi Bölgesi'ndeki modern tesislerimizde, 
                uzman kadromuzla her gün daha iyi ürünler üretmek için çalışıyoruz.
              </p>
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
                src="https://images.pexels.com/photos/7598137/pexels-photo-7598137.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="İbed Üretim"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-2xl overflow-hidden border-4 border-[#020617] hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1769690399055-6cac5380d470?crop=entropy&cs=srgb&fm=jpg&q=85"
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
            Değerlerimiz
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            İbed'i İbed yapan temel değerlerimiz
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
            Sizinle Tanışmak İsteriz
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Ürünlerimiz hakkında detaylı bilgi almak veya bayilik başvurusu yapmak 
            için bizimle iletişime geçin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/iletisim"
              data-testid="about-cta-contact"
              className="btn-primary inline-flex items-center justify-center"
            >
              İletişime Geç
            </Link>
            <Link
              to="/urunler"
              data-testid="about-cta-products"
              className="btn-secondary inline-flex items-center justify-center"
            >
              Ürünleri İncele
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
