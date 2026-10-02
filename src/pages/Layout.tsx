import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";

export default function Layout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
