import { Link } from "react-router-dom";
import { ArrowRight, MapPin, ShoppingCart, Award, Truck, Wrench } from "lucide-react";
import { useProductos } from "../data/useProductos";
import ProductCard from "../components/ProductCard";
import SobreNosotros from "../components/SobreNosotros";
import Contacto from "../components/Contacto";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
  const { productos, loading, error, categorias } = useProductos();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-violet-50 pt-[120px] md:pt-[128px] pb-14">
        <div className="pointer-events-none absolute -right-24 -bottom-40 h-[28rem] w-[28rem] rounded-full bg-violet-300/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-semibold tracking-wider text-violet-700 mb-5">
              <MapPin size={13} /> Salta 1577 · Ciudad de Mendoza
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold italic uppercase leading-[0.95] text-slate-900 [text-wrap:balance]">
              Todo para tu{" "}
              <span className="bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">sonido</span>, tus{" "}
              <span className="bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">luces</span> y tu set
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Venta e instalación de audio profesional, iluminación, DJ, micrófonos y pantallas LED. Enviamos a todo el país.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/productos" className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-7 py-3.5 font-semibold text-white hover:shadow-lg hover:shadow-violet-500/25 transition-shadow">
                <ShoppingCart size={19} /> Ver productos
              </Link>
              <Link to="/contacto" className="rounded-full border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-900 hover:border-violet-400">
                Pedir presupuesto
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { i: Award, t: "40 años", d: "de experiencia en el rubro" },
              { i: ShoppingCart, t: productos.length ? `+${Math.floor(productos.length / 100) * 100}` : "+1000", d: "productos publicados" },
              { i: Truck, t: "Envíos", d: "a todo el país" },
              { i: Wrench, t: "Instalación", d: "y servicio técnico" },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="rounded-xl border border-slate-200 bg-white p-4">
                <Icon size={20} className="text-violet-600 mb-2" />
                <b className="block font-heading text-2xl leading-none text-slate-900">{t}</b>
                <span className="text-sm text-slate-500">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Más vendidos por categoría */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="py-16 text-center text-slate-500">No pudimos cargar los productos. Recargá la página.</div>
      ) : (
        categorias.map((cat) => {
          const items = productos
            .filter((p) => p.categoria === cat && p.enStock)
            .sort((a, b) => b.vendidos - a.vendidos || b.calificacion - a.calificacion)
            .slice(0, 12);
          if (items.length < 4) return null;
          return (
            <section key={cat} className="py-10 px-4 border-b border-slate-100">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">{cat}</h2>
                    <p className="text-sm text-slate-500">Los más vendidos</p>
                  </div>
                  <Link to={`/productos?cat=${encodeURIComponent(cat)}`} className="flex flex-none items-center gap-1 text-sm font-semibold text-blue-600 hover:text-violet-700">
                    Ver todo <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x [scrollbar-width:thin]">
                  {items.map((p) => (
                    <div key={p.id} className="w-[46%] sm:w-[220px] flex-none snap-start">
                      <ProductCard producto={p} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })
      )}

      <SobreNosotros />
      <Contacto />
    </>
  );
}
