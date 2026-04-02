import type { Producto } from "../data/useProductos";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  productos: Producto[];
  onVerDetalle: (producto: Producto) => void;
}

export default function ProductGrid({ productos, onVerDetalle }: ProductGridProps) {
  if (productos.length === 0) {
    return <div className="text-center py-16 text-gray-400">No se encontraron productos.</div>;
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {productos.map((p, i) => (
        <ProductCard key={p.id} producto={p} onVerDetalle={onVerDetalle} index={i} />
      ))}
    </div>
  );
}
