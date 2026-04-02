import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProductos } from "../data/useProductos";
import type { Producto } from "../data/useProductos";
import ProductGrid from "../components/ProductGrid";
import ProductDetail from "../components/ProductDetail";
import LoadingSpinner from "../components/LoadingSpinner";

interface Props {
  categoria: string;
  titulo: string;
  subtitulo: string;
  icono: React.ReactNode;
  gradiente: string;
}

export default function CategoryPage({ categoria, titulo, subtitulo, icono, gradiente }: Props) {
  const { productos, loading, error, getSubcategorias } = useProductos();
  const [filtroSub, setFiltroSub] = useState("todas");
  const [sel, setSel] = useState<Producto | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const items = productos.filter((p) => p.categoria === categoria);
  const subcategorias = getSubcategorias(categoria);
  const filtrados = filtroSub === "todas" ? items : items.filter((p) => p.subcategoria === filtroSub);

  return (
    <section className="relative pt-24 md:pt-32 pb-24 px-4">
      <div className="max-w-8xl mx-auto">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-10">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${gradiente} mb-4`}>
            {icono}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white mb-4">
            {titulo} <span style={{ background: "linear-gradient(to right, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>{subtitulo}</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">{items.length} productos disponibles</p>
        </motion.div>

        {/* Subcategory filters */}
        {subcategorias.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button onClick={() => setFiltroSub("todas")} className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${filtroSub === "todas" ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white" : "bg-dark-800/60 text-gray-300 border border-white/10 hover:border-violet-500/30"}`}>
              Todas
            </button>
            {subcategorias.map((sub) => (
              <button key={sub} onClick={() => setFiltroSub(sub)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer capitalize ${filtroSub === sub ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white" : "bg-dark-800/60 text-gray-300 border border-white/10 hover:border-violet-500/30"}`}>
                {sub.replace(/-/g, " ")}
              </button>
            ))}
          </div>
        )}

        {loading ? <LoadingSpinner /> : error ? (
          <div className="text-center py-16 text-red-400">Error: {error}</div>
        ) : (
          <>
            <ProductGrid productos={filtrados} onVerDetalle={setSel} />
            <div className="mt-10 text-center">
              <Link to="/contacto" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/30 transition-all hover:scale-105">
                Solicitar presupuesto <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </div>

      {sel && <ProductDetail producto={sel} onClose={() => setSel(null)} />}
    </section>
  );
}
