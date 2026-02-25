import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, Check } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/contact`, formData);
      setSubmitted(true);
      toast.success(t("messageSent"));
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t("messageError"));
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t("phone"),
      value: "0352 321 17 55",
      href: "tel:03523211755",
    },
    {
      icon: Mail,
      title: t("email"),
      value: "info@ibed.com.tr",
      href: "mailto:info@ibed.com.tr",
    },
    {
      icon: MapPin,
      title: t("address"),
      value: t("addressValue"),
      href: "https://maps.google.com/?q=Kayseri+OSB+23.+Cad.+No:19+Melikgazi/Kayseri",
    },
  ];

  return (
    <div data-testid="contact-page" className="min-h-screen pt-24 sm:pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#4ecdc4]/10 border border-[#4ecdc4]/30 text-[#4ecdc4] text-sm font-medium mb-6">
            {t("contact")}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t("contactTitle")}
          </h1>
          <p className="text-slate-400 text-lg">
            {t("contactDescription")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.href}
                target={info.icon === MapPin ? "_blank" : undefined}
                rel={info.icon === MapPin ? "noopener noreferrer" : undefined}
                data-testid={`contact-info-${index}`}
                className="flex items-start gap-4 p-6 rounded-2xl bg-[#0f172a]/50 border border-white/5 hover:border-[#4ecdc4]/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#4ecdc4]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#4ecdc4]/20 transition-colors">
                  <info.icon className="w-6 h-6 text-[#4ecdc4]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">{info.title}</h3>
                  <p className="text-slate-400 text-sm">{info.value}</p>
                </div>
              </a>
            ))}

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-white/5 h-64 lg:h-auto lg:flex-1">
              <iframe
                title="İbed Konum"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3116.8!2d35.5!3d38.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKayseri%20OSB!5e0!3m2!1str!2str!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "200px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="contact-form-glass p-8 rounded-3xl">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-[#4ecdc4]/20 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-[#4ecdc4]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {t("messageReceived")}
                  </h3>
                  <p className="text-slate-400 mb-6">
                    {t("willContact")}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    data-testid="send-another-message"
                    className="text-[#4ecdc4] hover:underline"
                  >
                    {t("sendAnother")}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} data-testid="contact-form" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {t("yourName")} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        data-testid="contact-name"
                        className="input-field"
                        placeholder={t("yourName")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {t("yourEmail")} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        data-testid="contact-email"
                        className="input-field"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {t("yourPhone")}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        data-testid="contact-phone"
                        className="input-field"
                        placeholder="0555 555 55 55"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {t("subject")} *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        data-testid="contact-subject"
                        className="input-field"
                        placeholder={t("subject")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t("message")} *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      data-testid="contact-message"
                      className="input-field resize-none"
                      placeholder={t("message")}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    data-testid="contact-submit"
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#020617]/30 border-t-[#020617] rounded-full animate-spin" />
                        {t("sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t("sendMessage")}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
