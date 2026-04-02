import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, Search } from "lucide-react";
import { useProductos, categoriaNombres } from "../data/useProductos";
import type { Producto } from "../data/useProductos";
import ProductGrid from "../components/ProductGrid";
import ProductDetail from "../components/ProductDetail";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Productos() {
  const { productos, loading, error, categorias, getSubcategorias } = useProductos();
  const [busqueda, setBusqueda] = useState("");
  const [filtroCat, setFiltroCat] = useState("todos");
  const [filtroSub, setFiltroSub] = useState("todos");
  const [ordenPrecio, setOrdenPrecio] = useState("default");
  const [sel, setSel] = useState<Producto | null>(null);

  const subcats = filtroCat === "todos"
    ? [...new Set(productos.map((p) => p.subcategoria))]
    : getSubcategorias(filtroCat);

  let filtrados = productos.filter((p) => {
    if (!p.imagenes[0]) return false;
    if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase()) && !p.marca.toLowerCase().includes(busqueda.toLowerCase())) return false;
    if (filtroCat !== "todos" && p.categoria !== filtroCat) return false;
    if (filtroSub !== "todos" && p.subcategoria !== filtroSub) return false;
    return true;
  });

  if (ordenPrecio === "asc") filtrados = [...filtrados].sort((a, b) => (a.precio || 0) - (b.precio || 0));
  if (ordenPrecio === "desc") filtrados = [...filtrados].sort((a, b) => (b.precio || 0) - (a.precio || 0));

  return (
    <section className="relative pt-24 md:pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-cyan-400 border border-cyan-400/20 bg-cyan-400/5 mb-4">CATÁLOGO COMPLETO</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white mb-4">
            Todos los <span style={{ background: "linear-gradient(to right, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>Productos</span>
          </h1>
        </motion.div>

        <div className="mb-8 p-4 rounded-2xl bg-dark-800/50 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal size={14} className="text-violet-400" />
            <span className="text-sm font-semibold text-white">Filtrar</span>
            <span className="text-xs text-gray-500 ml-auto">{filtrados.length} productos</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-900/80 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-violet-500 outline-none transition-all" />
            </div>
            <select value={filtroCat} onChange={(e) => { setFiltroCat(e.target.value); setFiltroSub("todos"); }} className="px-4 py-2.5 rounded-xl bg-dark-900/80 border border-white/10 text-white text-sm focus:border-violet-500 outline-none appearance-none cursor-pointer">
              <option value="todos" className="bg-dark-900">Todas las categorías</option>
              {categorias.map((c) => <option key={c} value={c} className="bg-dark-900">{categoriaNombres[c] || c}</option>)}
            </select>
            <select value={filtroSub} onChange={(e) => setFiltroSub(e.target.value)} className="px-4 py-2.5 rounded-xl bg-dark-900/80 border border-white/10 text-white text-sm focus:border-violet-500 outline-none appearance-none cursor-pointer">
              <option value="todos" className="bg-dark-900">Subcategorías</option>
              {subcats.map((s) => <option key={s} value={s} className="bg-dark-900 capitalize">{s.replace(/-/g, " ")}</option>)}
            </select>
            <select value={ordenPrecio} onChange={(e) => setOrdenPrecio(e.target.value)} className="px-4 py-2.5 rounded-xl bg-dark-900/80 border border-white/10 text-white text-sm focus:border-violet-500 outline-none appearance-none cursor-pointer">
              <option value="default" className="bg-dark-900">Ordenar</option>
              <option value="asc" className="bg-dark-900">Precio: menor a mayor</option>
              <option value="desc" className="bg-dark-900">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {loading ? <LoadingSpinner /> : error ? (
          <div className="text-center py-16 text-red-400">Error: {error}</div>
        ) : (
          <ProductGrid productos={filtrados} onVerDetalle={setSel} />
        )}

        {!loading && filtrados.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">No se encontraron productos.</p>
            <button onClick={() => { setBusqueda(""); setFiltroCat("todos"); setFiltroSub("todos"); }} className="px-6 py-2 rounded-full border border-violet-500/30 text-violet-400 text-sm hover:bg-violet-500/10 transition-all cursor-pointer">Limpiar filtros</button>
          </div>
        )}
      </div>

      {sel && <ProductDetail producto={sel} onClose={() => setSel(null)} />}
    </section>
  );
}
