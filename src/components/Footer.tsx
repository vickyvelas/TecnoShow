import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, MessageCircle, Star } from "lucide-react";
import { GRUPOS, INSTAGRAM, CANAL_WHATSAPP, RESENA_GOOGLE, MAPA, WHATSAPP } from "../data/useProductos";

const Instagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export default function Footer() {
  return (
    <>
      <section className="bg-gradient-to-r from-blue-50 to-violet-50 border-t border-slate-200" aria-label="Reseñas y redes">
        <div className="max-w-7xl mx-auto px-4 py-7 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex flex-none text-violet-600" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={22} className="fill-current" />)}
            </div>
            <div>
              <h2 className="font-heading text-2xl font-extrabold italic uppercase leading-none text-slate-900">¿Te atendimos bien?</h2>
              <p className="text-slate-500 mt-1">Tu reseña en Google nos ayuda muchísimo. Te lleva un minuto.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <a href={RESENA_GOOGLE} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white">
              Dejar una reseña en Google
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900">
              <span className="text-[#e1306c]"><Instagram /></span> Seguinos en Instagram
            </a>
            <a href={CANAL_WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900">
              <MessageCircle size={18} className="text-[#25D366]" /> Unite al canal de WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 border-t border-slate-200 text-slate-600">
        <div className="h-[3px] bg-gradient-to-r from-blue-500 to-violet-600" />
        <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[4fr_2fr_3fr_3fr]">
          <div>
            <img src="/logo-color.png" alt="TecnoShow" className="h-11 w-auto mb-4" />
            <p className="text-sm leading-relaxed mb-4">
              Empresa líder en Cuyo con 40 años de experiencia en audio, iluminación, video y pantallas LED.
            </p>
            <div className="flex gap-3">
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-violet-600"><Instagram /></a>
              <a href={CANAL_WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="Canal de WhatsApp" className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#25D366]"><MessageCircle size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-slate-900 mb-4">Productos</h4>
            <div className="space-y-2 text-sm">
              {Object.entries(GRUPOS).map(([k, g]) => (
                <Link key={k} to={`/productos?grupo=${k}`} className="block hover:text-violet-600">{g.nombre}</Link>
              ))}
              <Link to="/productos" className="block hover:text-violet-600">Todos los productos</Link>
              <Link to="/contacto" className="block hover:text-violet-600">Pedir presupuesto</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-slate-900 mb-4">Ubicación</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-violet-600 mt-0.5 flex-none" />
                <div>
                  <p className="text-slate-900 font-medium">Salta 1577, Ciudad de Mendoza</p>
                  <a href={MAPA} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Cómo llegar</a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-violet-600 mt-0.5 flex-none" />
                <p>Lunes a viernes de 10 a 17 hs</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-slate-900 mb-4">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Phone size={16} className="text-violet-600 flex-none" /><span className="select-all">261 418 9999</span></div>
              <div className="flex items-center gap-2"><Mail size={16} className="text-violet-600 flex-none" /><span className="select-all break-all">tecnoshowargentina@hotmail.com</span></div>
              <div className="flex gap-3 pt-1">
                <figure className="text-center text-xs">
                  <img src="/qr-wa.png" alt="QR del WhatsApp de TecnoShow" className="w-24 h-24 bg-white border border-slate-200 rounded-lg p-1 mb-1" />
                  <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                </figure>
                <figure className="text-center text-xs">
                  <a href={CANAL_WHATSAPP} target="_blank" rel="noopener noreferrer">
                    <img src="/qr-canal.png" alt="QR del canal de WhatsApp de TecnoShow" className="w-24 h-24 bg-white border border-slate-200 rounded-lg p-1 mb-1" />
                    Canal de novedades
                  </a>
                </figure>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} TecnoShow · Mendoza, Argentina. Precios y stock sujetos a cambios.
        </div>
      </footer>
    </>
  );
}
