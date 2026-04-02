import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MapPin, ShoppingCart } from "lucide-react";
import { useProductos, categoriaNombres } from "../data/useProductos";
import ProductCarousel from "../components/ProductCarousel";
import ProductDetail from "../components/ProductDetail";
import SobreNosotros from "../components/SobreNosotros";
import Contacto from "../components/Contacto";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Producto } from "../data/useProductos";

export default function Home() {
  const { productos, loading, error, categorias } = useProductos();
  const [sel, setSel] = useState<Producto | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80"
            alt="Show de luces"
            style={{ filter: "brightness(0.5)", width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="absolute inset-0 bg-dark-950/90" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/90 to-dark-950" />
        </div>

        <motion.div animate={{ y: [-20, 20, -20] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl" />
        <motion.div animate={{ y: [20, -20, 20] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm mb-8">
            <Sparkles size={16} className="text-cyan-400" />
            <span className="text-sm text-gray-200">Distribuidores oficiales en Cuyo · +25 años</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-5xl sm:text-6xl md:text-7xl font-bold font-heading mb-6">
            <img src="/logo.png" alt="TecnoShow" className="h-20 sm:h-24 md:h-28 mx-auto" />
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-lg sm:text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Venta e instalación de audio, iluminación <span className="text-cyan-400">y pantallas LED profesionales</span>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-10">
            <MapPin size={14} className="text-violet-400" />
            <span>Local en Mendoza · Envíos a todo el país</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contacto" className="px-8 py-4 rounded-full font-semibold text-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-violet-500/30 transition-all hover:scale-105 flex items-center gap-2">
              <ShoppingCart size={20} /> Solicitar Presupuesto
            </Link>
            <Link to="/productos" className="px-8 py-4 rounded-full font-semibold text-lg border border-white/20 text-white hover:border-violet-500/50 transition-all">
              Ver Productos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Category carousels */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-16 text-red-400">Error al cargar productos: {error}</div>
      ) : (
        categorias.map((cat) => {
          const items = productos.filter((p) => p.categoria === cat);
          if (items.length === 0) return null;
          return (
            <section key={cat} className="py-16 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                    {categoriaNombres[cat] || cat}
                  </h2>
                  <Link to={`/${cat}`} className="text-sm text-cyan-400 hover:text-violet-400 transition-colors flex items-center gap-1">
                    Ver todo <ArrowRight size={14} />
                  </Link>
                </div>
                <p className="text-gray-400 text-sm mb-6">{items.length} productos</p>
                <ProductCarousel productos={items} onVerDetalle={setSel} />
              </div>
            </section>
          );
        })
      )}

      <SobreNosotros />
      <Contacto />

      {sel && <ProductDetail producto={sel} onClose={() => setSel(null)} />}
    </>
  );
}
