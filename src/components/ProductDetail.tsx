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

  // swipe
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // zoom
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  if (!producto || producto.imagenes.length === 0) return null;

  const imgs = producto.imagenes;

  const precioFmt = producto.precio
    ? producto.precio.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
      })
    : "Consultar precio";

  const waMsg = `Hola! Quiero consultar por: ${producto.nombre}`;
  const waLink = `https://wa.me/5492614189999?text=${encodeURIComponent(waMsg)}`;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-3xl bg-dark-900 rounded-2xl border border-white/10 mx-auto"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {/* cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-dark-800/80 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>

          {/* GRID */}
          <div className="grid grid-cols-[1fr_3fr_2fr] items-center gap-8">

            {/* MINIATURAS */}
            {
              <div className="flex flex-col items-center gap-4 w-full">
                {imgs.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`flex-shrink-0 w-20 h-20 md:w-full md:h-auto md:aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      i === imgIdx
                        ? "border-violet-500"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            }

            {/* IMAGEN */}
            <div
              className="relative flex items-center justify-center"
              onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchStartX === null) return;
                const diff = e.changedTouches[0].clientX - touchStartX;

                if (diff > 50) {
                  setImgIdx((i) => (i - 1 + imgs.length) % imgs.length);
                } else if (diff < -50) {
                  setImgIdx((i) => (i + 1) % imgs.length);
                }

                setTouchStartX(null);
              }}
            >
              {/* zoom container */}
              <div
                className="w-full h-full object-contain bg-white mx-auto block overflow-hidden"
                onMouseEnter={() => setZoom(true)}
                onMouseLeave={() => setZoom(false)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setPos({ x, y });
                }}
              >
                <motion.img
                  key={imgIdx}
                  src={imgs[imgIdx]}
                  alt={producto.nombre}
                  className="max-w-full max-h-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    transform: zoom ? "scale(2)" : "scale(1)",
                    transformOrigin: `${pos.x}% ${pos.y}%`,
                  }}
                />
              </div>

              {/* flechas */}
              {imgs.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((i) => (i - 1 + imgs.length) % imgs.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur shadow-md hover:bg-white transition"
                  >
                    <ChevronLeft size={20} className="text-black drop-shadow" />
                  </button>

                  <button
                    onClick={() => setImgIdx((i) => (i + 1) % imgs.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur shadow-md hover:bg-white transition"
                  >
                    <ChevronRight size={20} className="text-black drop-shadow" />
                  </button>
                </>
              )}
            </div>

            {/* INFO */}
            <div className="flex flex-col justify-center md:col-span-2 gap-3">
              {producto.marca && (
                <span className="text-m text-cyan-400 mb-2 uppercase">
                  {producto.marca}
                </span>
              )}

              <h2 className="text-3xl md:text-2xl font-bold text-white mb-3">
                {producto.nombre}
              </h2>

              <div className="text-2xl md:text-3xl font-bold text-violet-400 mb-4">
                {precioFmt}
              </div>

              {producto.descripcion && (
                <p className="text-sm text-gray-300 mb-4">
                  {producto.descripcion}
                </p>
              )}

              {producto.stock && (
                <div className="flex items-center gap-2 text-sm mb-4">
                  <Package size={14} />
                  <span>{producto.stock} unidades disponibles</span>
                </div>
              )}

              <div className="mt-auto">
                <a
                  href={waLink}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-fit px-4 py-3 rounded-xl bg-[#25D366] text-white font-semibold"
                >
                  <MessageCircle size={20} />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}