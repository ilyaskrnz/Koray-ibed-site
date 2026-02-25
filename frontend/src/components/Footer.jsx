import { Link } from "react-router-dom";
import { Phone, MapPin, Mail, ArrowUpRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer data-testid="footer" className="bg-[#0f172a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img
              src="https://customer-assets.emergentagent.com/job_ibed-store/artifacts/8a77bb1w_WhatsApp%20Image%202026-02-22%20at%2014.44.57.jpeg"
              alt="İbed Logo"
              className="h-14 w-auto rounded-lg mb-6"
            />
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-6">
              İbed olarak, kaliteli uykunun önemini biliyoruz. Yıllarca süren deneyim ve
              teknolojik yeniliklerle, size en iyi uyku deneyimini sunmak için çalışıyoruz.
            </p>
            <p className="text-[#4ecdc4] text-sm font-medium">
              smart bed, smart sleep
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Hızlı Linkler</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  data-testid="footer-link-home"
                  className="text-slate-400 hover:text-[#4ecdc4] transition-colors text-sm flex items-center gap-1 group"
                >
                  Ana Sayfa
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/urunler"
                  data-testid="footer-link-products"
                  className="text-slate-400 hover:text-[#4ecdc4] transition-colors text-sm flex items-center gap-1 group"
                >
                  Ürünler
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/hakkimizda"
                  data-testid="footer-link-about"
                  className="text-slate-400 hover:text-[#4ecdc4] transition-colors text-sm flex items-center gap-1 group"
                >
                  Hakkımızda
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/iletisim"
                  data-testid="footer-link-contact"
                  className="text-slate-400 hover:text-[#4ecdc4] transition-colors text-sm flex items-center gap-1 group"
                >
                  İletişim
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">İletişim</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:03523211755"
                  data-testid="footer-phone"
                  className="text-slate-400 hover:text-[#4ecdc4] transition-colors text-sm flex items-start gap-3"
                >
                  <Phone className="w-4 h-4 mt-0.5 text-[#4ecdc4]" />
                  <span>0352 321 17 55</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@ibed.com.tr"
                  data-testid="footer-email"
                  className="text-slate-400 hover:text-[#4ecdc4] transition-colors text-sm flex items-start gap-3"
                >
                  <Mail className="w-4 h-4 mt-0.5 text-[#4ecdc4]" />
                  <span>info@ibed.com.tr</span>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=Kayseri+OSB+23.+Cad.+No:19+Melikgazi/Kayseri"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="footer-address"
                  className="text-slate-400 hover:text-[#4ecdc4] transition-colors text-sm flex items-start gap-3"
                >
                  <MapPin className="w-4 h-4 mt-0.5 text-[#4ecdc4] flex-shrink-0" />
                  <span>Kayseri OSB 23. Cad. No:19 Melikgazi/Kayseri</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} İbed. Tüm hakları saklıdır.
          </p>
          <p className="text-slate-600 text-xs">
            Kayseri'de tasarlandı ve üretildi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
