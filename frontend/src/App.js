import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <LanguageProvider>
      <div className="App min-h-screen bg-[#020617]">
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/urunler" element={<ProductsPage />} />
              <Route path="/urunler/:id" element={<ProductDetailPage />} />
              <Route path="/hakkimizda" element={<AboutPage />} />
              <Route path="/iletisim" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
          <Toaster position="bottom-right" />
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
