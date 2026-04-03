import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Volume2, Lightbulb, MonitorPlay, ShoppingCart, Phone, Wrench } from "lucide-react";

const categorias = [
  { label: "Audio", href: "/audio", icon: Volume2 },
  { label: "Iluminación", href: "/iluminacion", icon: Lightbulb },
  { label: "Video", href: "/video", icon: MonitorPlay },
  { label: "Accesorios", href: "/accesorios", icon: Wrench },
];

const menuLinks = [
  { label: "Inicio", href: "/", icon: null },
  { label: "Audio", href: "/audio", icon: Volume2 },
  { label: "Iluminación", href: "/iluminacion", icon: Lightbulb },
  { label: "Video", href: "/video", icon: MonitorPlay },
  { label: "Accesorios", href: "/accesorios", icon: Wrench },
  { label: "Productos", href: "/productos", icon: ShoppingCart },
  { label: "Presupuesto", href: "/contacto", icon: Phone },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const go = (href: string) => {
    if (href === "maps") {
      window.open("https://maps.google.com/?q=Salta+1577+Mendoza", "_blank");
      return;
    }
    navigate(href);
    setMobileOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-950 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo + categorías */}
          <div className="flex items-center gap-4">
            <Link to="/" onClick={(e) => { e.preventDefault(); go("/"); }}>
              <img src="/logo.png" alt="TecnoShow" className="h-10 md:h-11 w-auto" />
            </Link>

            <div className="hidden md:flex items-center gap-1 ml-2">
              {categorias.map((cat) => (
                <Link
                  key={cat.href}
                  to={cat.href}
                  onClick={(e) => { e.preventDefault(); go(cat.href); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                    isActive(cat.href)
                      ? "text-cyan-400 bg-cyan-400/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <cat.icon size={15} />
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop: productos + presupuesto */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/productos"
              onClick={(e) => { e.preventDefault(); go("/productos"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                isActive("/productos")
                  ? "text-cyan-400 bg-cyan-400/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShoppingCart size={15} />
              Productos
            </Link>
            <Link
              to="/contacto"
              onClick={(e) => { e.preventDefault(); go("/contacto"); }}
              className="px-5 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-violet-500/30 transition-all hover:scale-105 cursor-pointer"
            >
              Presupuesto
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white bg-dark-800 rounded-lg border border-white/10 cursor-pointer"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <div className="md:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute right-4 top-[calc(100%+4px)] w-56 bg-dark-900 rounded-xl border border-violet-600/30 shadow-2xl shadow-black/50 z-50 overflow-hidden"
            >
              <div className="p-3 space-y-1">
                {menuLinks.map((link) => (
                  <div
                    key={link.href}
                    onClick={() => go(link.href)}
                    className={`flex items-center gap-3 text-sm font-medium py-2.5 px-3 rounded-lg transition-all cursor-pointer ${
                      isActive(link.href)
                        ? "text-cyan-400 bg-cyan-400/10"
                        : "text-gray-200 hover:text-white hover:bg-violet-500/10"
                    }`}
                  >
                    {link.icon && <link.icon size={16} className="text-violet-400" />}
                    {link.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
