import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { useProductos, linkWhatsApp } from "../data/useProductos";
import ProductCard, { Precio, Calificacion } from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProductoPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { productos, loading } = useProductos();
  const [foto, setFoto] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => { setFoto(0); window.scrollTo({ top: 0 }); }, [id]);

  if (loading) return <div className="pt-32 min-h-screen"><LoadingSpinner /></div>;
  const p = productos.find((x) => x.id === decodeURIComponent(id));
  if (!p)
    return (
      <div className="pt-36 pb-24 min-h-screen text-center text-slate-600">
        <p className="mb-4">No encontramos este producto.</p>
        <Link to="/productos" className="text-blue-600 underline">Ver todos los productos</Link>
      </div>
    );

  const relacionados = productos
    .filter((x) => x.subcategoria === p.subcategoria && x.id !== p.id)
    .sort((a, b) => Number(b.enStock) - Number(a.enStock) || b.vendidos - a.vendidos)
    .slice(0, 6);
  const mitad = Math.ceil(p.caracteristicas.length / 2);
  const Tabla = ({ filas }: { filas: { clave: string; valor: string }[] }) => (
    <table className="w-full text-sm border-collapse">
      <tbody>
        {filas.map((c, i) => (
          <tr key={c.clave + i} className={i % 2 ? "bg-slate-50" : ""}>
            <th scope="row" className={`w-[46%] text-left font-semibold text-slate-800 px-3 py-2.5 align-top ${i % 2 ? "bg-slate-100" : "bg-slate-50"}`}>{c.clave}</th>
            <td className="px-3 py-2.5 text-slate-700 align-top">{c.valor}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  const img = p.imagenes[foto] || p.imagenes[0];

  return (
    <div className="pt-[88px] md:pt-[96px] pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/productos"))} className="flex items-center gap-1 text-sm text-blue-600 my-4 cursor-pointer">
          <ChevronLeft size={16} /> Volver al listado
        </button>

        <article className="rounded-lg border border-slate-200 p-4 md:p-6 grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-8">
          {/* galería */}
          <div className={`grid sm:grid-cols-[64px_minmax(0,1fr)] gap-3 items-start ${p.enStock ? "" : "grayscale opacity-60"}`}>
            <div className="order-2 sm:order-1 flex sm:flex-col gap-2 overflow-x-auto">
              {p.imagenes.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setFoto(i)}
                  className={`flex-none w-16 h-16 rounded border bg-white p-1 cursor-pointer ${i === foto ? "border-2 border-blue-600" : "border-slate-200"}`}
                  aria-label={`Foto ${i + 1}`}
                >
                  <img src={src} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
            <div
              className="order-1 sm:order-2 aspect-square bg-white rounded overflow-hidden flex items-center justify-center cursor-zoom-in"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
              }}
            >
              {img ? (
                <img
                  src={img}
                  alt={`${p.nombre} – foto ${foto + 1}`}
                  className="max-w-full max-h-full object-contain transition-transform duration-150"
                  style={{ transform: zoom ? "scale(2)" : "scale(1)", transformOrigin: `${pos.x}% ${pos.y}%` }}
                />
              ) : (
                <span className="text-slate-300">Sin foto</span>
              )}
            </div>
          </div>

          {/* info */}
          <div className="flex flex-col gap-3 min-w-0">
            {p.vendidos > 0 && <div className="text-xs text-slate-500">+{p.vendidos} vendidos</div>}
            <h1 className="text-2xl font-semibold leading-tight text-slate-900 [text-wrap:balance]">{p.nombre}</h1>
            <Calificacion p={p} />
            <Precio p={p} grande />
            {!p.enStock && (
              <p className="text-sm text-slate-500">
                Por ahora no tenemos stock de este producto. Escribinos y te avisamos cuando reingresa o te ofrecemos una alternativa.
              </p>
            )}
            <div className="grid gap-2 mt-2">
              <a href={linkWhatsApp(p)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 font-semibold text-[#08331a]">
                <MessageCircle size={20} /> Consultar por WhatsApp
              </a>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center rounded-lg px-4 py-3 font-semibold ${p.enStock ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white" : "bg-slate-100 text-blue-600"}`}
                >
                  {p.enStock ? "Comprar en Mercado Libre" : "Ver publicación en Mercado Libre"}
                </a>
              )}
            </div>
            <div className="grid gap-2 mt-2 text-sm text-slate-500">
              <div className="flex gap-2"><MapPin size={16} className="text-violet-600 flex-none mt-0.5" /><span><b className="text-slate-800 font-semibold">Retiro en el local:</b> Salta 1577, Ciudad de Mendoza</span></div>
              <div className="flex gap-2"><ShieldCheck size={16} className="text-violet-600 flex-none mt-0.5" /><span><b className="text-slate-800 font-semibold">Asesoramiento</b> de 40 años en audio, video e iluminación</span></div>
            </div>
          </div>

          {p.caracteristicas.length > 0 && (
            <section className="lg:col-span-2 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-medium text-slate-900 mb-4">Características del producto</h2>
              <div className="grid md:grid-cols-2 gap-x-6">
                <Tabla filas={p.caracteristicas.slice(0, mitad)} />
                <Tabla filas={p.caracteristicas.slice(mitad)} />
              </div>
            </section>
          )}
          {p.descripcion && (
            <section className="lg:col-span-2 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-medium text-slate-900 mb-4">Descripción</h2>
              <p className="whitespace-pre-line text-slate-600 max-w-[75ch]">{p.descripcion}</p>
            </section>
          )}
          {relacionados.length > 0 && (
            <section className="lg:col-span-2 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-medium text-slate-900 mb-4">Productos relacionados</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {relacionados.map((r) => <ProductCard key={r.id} producto={r} />)}
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
