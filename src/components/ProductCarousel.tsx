import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Producto } from "../data/useProductos";
import ProductCard from "./ProductCard";

interface ProductCarouselProps {
  productos: Producto[];
  onVerDetalle: (producto: Producto) => void;
}

export default function ProductCarousel({ productos, onVerDetalle }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  if (productos.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex gap-2 justify-end mb-4">
        <button onClick={() => scroll("left")} className="w-9 h-9 rounded-lg bg-dark-800/60 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/30 transition-all cursor-pointer">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => scroll("right")} className="w-9 h-9 rounded-lg bg-dark-800/60 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/30 transition-all cursor-pointer">
          <ChevronRight size={18} />
        </button>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}>
        {productos.map((p, i) => (
          <div key={p.id} className="flex-shrink-0 w-[160px] sm:w-[180px]">
            <ProductCard producto={p} onVerDetalle={onVerDetalle} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
