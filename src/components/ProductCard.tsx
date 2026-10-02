import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Producto } from "../data/useProductos";
import { formatearPrecio } from "../data/useProductos";

export function Precio({ p, grande = false }: { p: Producto; grande?: boolean }) {
  if (!p.enStock)
    return (
      <div>
        <div className={`font-semibold uppercase tracking-wide text-slate-500 ${grande ? "text-lg" : "text-sm"}`}>Sin stock</div>
        <div className="text-sm font-semibold text-violet-600">Consultá disponibilidad</div>
      </div>
    );
  if (!p.precio) return <div className="text-sm font-semibold text-violet-600">Consultar precio</div>;
  const off = p.precioAnterior ? Math.round((1 - p.precio / p.precioAnterior) * 100) : 0;
  return (
    <div>
      {p.precioAnterior && <div className="text-xs text-slate-500 line-through tabular-nums">{formatearPrecio(p.precioAnterior)}</div>}
      <div className={`flex items-baseline gap-2 flex-wrap tabular-nums text-slate-900 ${grande ? "text-4xl" : "text-2xl"}`}>
        {formatearPrecio(p.precio)}
        {off > 0 && <span className="text-sm font-medium text-emerald-600">{off}% OFF</span>}
      </div>
    </div>
  );
}

export function Calificacion({ p }: { p: Producto }) {
  if (!p.calificacion && !p.vendidos) return null;
  return (
    <div className="flex items-center gap-1 text-xs text-slate-500">
      {p.calificacion > 0 && (
        <>
          <b className="font-medium text-slate-700">{p.calificacion.toFixed(1)}</b>
          <Star size={11} className="fill-blue-600 text-blue-600" />
        </>
      )}
      {p.vendidos > 0 && <span>{p.calificacion > 0 ? "| " : ""}+{p.vendidos} vendidos</span>}
    </div>
  );
}

export default function ProductCard({ producto: p }: { producto: Producto }) {
  return (
    <Link
      to={`/producto/${encodeURIComponent(p.id)}`}
      className="group flex flex-col min-w-0 bg-white rounded-lg border border-slate-200 hover:border-violet-200 hover:shadow-[0_6px_22px_rgba(18,16,40,0.10)] transition-all"
    >
      <div className="relative aspect-square bg-white rounded-t-lg border-b border-slate-200 overflow-hidden">
        {p.imagenes[0] ? (
          <img
            src={p.imagenes[0]}
            alt={p.nombre}
            loading="lazy"
            className={`w-full h-full object-contain p-3 transition-transform group-hover:scale-[1.03] ${p.enStock ? "" : "grayscale opacity-50"}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">Sin foto</div>
        )}
        {!p.enStock && (
          <span className="absolute left-2 top-2 rounded bg-slate-600 px-2 py-0.5 text-[11px] font-semibold text-white">
            Sin stock · Consultar
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3.5 min-w-0">
        <h3 className={`text-sm leading-snug line-clamp-2 min-h-[2.6em] ${p.enStock ? "text-slate-800" : "text-slate-500"}`}>{p.nombre}</h3>
        <Calificacion p={p} />
        <Precio p={p} />
      </div>
    </Link>
  );
}
