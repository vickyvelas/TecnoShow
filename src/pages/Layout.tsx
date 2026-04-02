import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";

export default function Layout() {
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
