import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Menu, Search, X, MessageCircle } from "lucide-react";
import { GRUPOS, INSTAGRAM, WHATSAPP } from "../data/useProductos";

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const links = [
  ...Object.entries(GRUPOS).map(([k, g]) => ({ label: g.nombre, href: `/productos?grupo=${k}` })),
  { label: "Todos los productos", href: "/productos" },
  { label: "Presupuesto", href: "/contacto" },
];

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");

  useEffect(() => { setAbierto(false); }, [location]);
  useEffect(() => { setQ(sp.get("q") || ""); }, [sp]);

  const activo = (href: string) => location.pathname + location.search === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-[0_2px_10px_rgba(18,16,40,0.04)]">
      <div className="h-[3px] bg-gradient-to-r from-blue-500 to-violet-600" />
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 md:gap-5 py-2.5 flex-wrap md:flex-nowrap">
        <Link to="/" className="flex-none flex flex-col">
          <img src="/logo-color.png" alt="TecnoShow" className="h-8 md:h-10 w-auto" />
          <span className="hidden md:block text-[10px] tracking-[0.18em] uppercase text-violet-600 mt-0.5">Audio · Video · Iluminación</span>
        </Link>

        <form
          role="search"
          onSubmit={(e) => { e.preventDefault(); navigate(q.trim() ? `/productos?q=${encodeURIComponent(q.trim())}` : "/productos"); }}
          className="order-3 md:order-none basis-full md:basis-auto flex-1 min-w-0 flex rounded-full border border-slate-200 bg-slate-50 focus-within:border-violet-500 focus-within:bg-white overflow-hidden"
        >
          <input
            id="buscar"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar productos, marcas y más…"
            aria-label="Buscar"
            className="flex-1 min-w-0 bg-transparent px-4 py-2.5 text-sm text-slate-900 outline-none"
          />
          <button className="px-4 bg-gradient-to-r from-blue-500 to-violet-600 text-white cursor-pointer" aria-label="Buscar">
            <Search size={17} />
          </button>
        </form>

        <div className="ml-auto md:ml-0 flex items-center gap-2 flex-none">
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram de TecnoShow" className="w-9 h-9 rounded-full flex items-center justify-center text-white bg-[linear-gradient(45deg,#f9a03f,#e1306c_50%,#7b3dff)]">
            <InstagramIcon />
          </a>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-900">
            <MessageCircle size={20} className="text-[#25D366]" />
            <span>261 418 9999<small className="block text-[11px] font-normal text-slate-500">Consultas por WhatsApp</small></span>
          </a>
          <button onClick={() => setAbierto(!abierto)} className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-700 cursor-pointer" aria-label="Menú">
            {abierto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className="hidden md:block border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 text-sm">
          <Link to="/" className={`px-3 py-2.5 border-b-2 ${location.pathname === "/" ? "border-violet-600 text-violet-700 font-semibold" : "border-transparent text-slate-600 hover:text-slate-900"}`}>Inicio</Link>
          {links.map((l) => (
            <Link key={l.href} to={l.href} className={`px-3 py-2.5 border-b-2 ${activo(l.href) ? "border-violet-600 text-violet-700 font-semibold" : "border-transparent text-slate-600 hover:text-slate-900"}`}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {abierto && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-2">
          {[{ label: "Inicio", href: "/" }, ...links].map((l) => (
            <Link key={l.href} to={l.href} className="block py-2.5 text-[15px] text-slate-800 border-b border-slate-100 last:border-0">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
