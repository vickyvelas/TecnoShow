import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Producto } from "../data/useProductos";

interface Props {
  producto: Producto | null;
  onClose: () => void;
}

export default function ProductDetail({ producto, onClose }: Props) {
  const [imgIdx, setImgIdx] = useState(0);

  if (!producto || producto.imagenes.length === 0) return null;

  const imgs = producto.imagenes;
  const precioFmt = producto.precio
    ? producto.precio.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 })
    : "Consultar precio";

  const waMsg = `Hola! Quiero consultar por: ${producto.nombre}${producto.stock ? ` (SKU: ${producto.id})` : ""}`;
  const waLink = `https://wa.me/5492614189999?text=${encodeURIComponent(waMsg)}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-dark-900 rounded-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-dark-800/80 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>

          <div className="grid grid-cols-[70px_1fr_1fr] md:grid-cols-[90px_1.5fr_1fr] gap-0 min-h-[400px]">
            {/* Izquierda: miniaturas */}
            {imgs.length > 1 && (
              <div className="flex flex-col gap-2 p-3 bg-dark-800/50 overflow-y-auto max-h-[500px]">
                {imgs.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    onMouseEnter={() => setImgIdx(i)}
                    className={`flex-shrink-0 w-full aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      i === imgIdx ? "border-violet-500" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Centro: imagen grande */}
            <div className="relative flex items-center justify-center bg-dark-800 p-4">
              <img
                src={imgs[imgIdx]}
                alt={producto.nombre}
                className="max-w-full max-h-[450px] object-contain"
              />
              {imgs.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((i) => (i - 1 + imgs.length) % imgs.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-300/90 flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-all cursor-pointer z-10 shadow-md"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setImgIdx((i) => (i + 1) % imgs.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-300/90 flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-all cursor-pointer z-10 shadow-md"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Derecha: info */}
            <div className="p-6 flex flex-col">
              {producto.marca && (
                <span className="text-xs text-cyan-400 font-medium mb-2 uppercase tracking-wider">{producto.marca}</span>
              )}

              <h2 className="text-xl md:text-2xl font-bold font-heading text-white mb-3 leading-snug">
                {producto.nombre}
              </h2>

              <div className="text-3xl font-bold mb-5" style={{ background: "linear-gradient(to right, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
                {precioFmt}
              </div>

              {producto.descripcion && (
                <div className="mb-5">
                  <p className="text-sm text-gray-300 leading-relaxed">{producto.descripcion}</p>
                </div>
              )}

              {producto.stock && (
                <div className="flex items-center gap-2 text-sm mb-5">
                  <Package size={14} className="text-cyan-400" />
                  <span className="text-gray-400">Stock disponible:</span>
                  <span className="text-white font-medium">{producto.stock} unidades</span>
                </div>
              )}

              <div className="mt-auto pt-4">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors"
                >
                  <MessageCircle size={20} />
                  Consultar por WhatsApp
                </a>
                <p className="text-xs text-gray-500 text-center mt-2">Respondemos en menos de 24 horas</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
