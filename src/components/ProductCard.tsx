import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Producto } from "../data/useProductos";
import { motion } from "framer-motion";

interface ProductCardProps {
  producto: Producto;
  onVerDetalle: (producto: Producto) => void;
  index?: number;
}

export default function ProductCard({ producto, onVerDetalle, index = 0 }: ProductCardProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs = producto.imagenes;
  if (!imgs[0]) return null;

  const precioFmt = producto.precio
    ? producto.precio.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 })
    : "Consultar";

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + imgs.length) % imgs.length); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % imgs.length); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group relative rounded-xl bg-dark-800/60 border border-white/5 hover:border-violet-500/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden h-[250px] flex flex-col cursor-pointer"
      onClick={() => onVerDetalle(producto)}
    >
      {/* COntenedor de la Imagen */}
      <div className="relative aspect-square overflow-hidden bg-white">
        <img
          src={imgs[imgIdx]}
          alt={producto.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Flechas */}
        {imgs.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-300/90 backdrop-blur-sm flex items-center justify-center text-gray-800 opacity-60 group-hover:opacity-100 transition-all hover:bg-gray-200 cursor-pointer z-10 shadow-md">
              <ChevronLeft size={16} />
            </button>
            <button onClick={next} className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-300/90 backdrop-blur-sm flex items-center justify-center text-gray-800 opacity-60 group-hover:opacity-100 transition-all hover:bg-gray-200 cursor-pointer z-10 shadow-md">
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Indicadores */}
        {imgs.length > 1 && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
            {imgs.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === imgIdx ? "bg-white w-3" : "bg-white/40 w-1"}`} />
            ))}
          </div>
        )}

        {producto.marca && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-cyan-300 bg-black/40 backdrop-blur-sm" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
            {producto.marca}
          </span>
        )}
      </div>

      <div className="p-2 flex flex-col flex-1">
        <h3 className="text-xs font-semibold text-white mb-1 line-clamp-2 group-hover:text-violet-300 transition-colors leading-snug">
          {producto.nombre}
        </h3>
        <div className="mt-auto">
          <span className="text-sm font-bold" style={{ background: "linear-gradient(to right, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
            {precioFmt}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
