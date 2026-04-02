import { MapPin, Phone, Mail, Clock } from "lucide-react";

const SocialIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "instagram":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case "facebook":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "youtube":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      );
    case "tiktok":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      );
    default:
      return null;
  }
};

const socialLinks = [
  { type: "instagram", href: "https://instagram.com/tecnoshow", label: "Instagram" },
  { type: "facebook", href: "https://facebook.com/tecnoshow", label: "Facebook" },
  { type: "youtube", href: "https://youtube.com/@tecnoshow", label: "YouTube" },
  { type: "tiktok", href: "https://tiktok.com/@tecnoshow", label: "TikTok" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="TecnoShow" className="h-12 w-auto" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Empresa líder en Cuyo con más de 25 años de experiencia en audio,
              iluminación y video profesional.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-dark-800/50 border border-white/5 flex items-center justify-center text-gray-400 hover:text-violet-400 hover:border-violet-500/30 transition-all duration-300"
                >
                  <SocialIcon type={social.type} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold font-heading mb-4">Enlaces</h4>
            <div className="space-y-2">
              {["Inicio", "Servicios", "Galería", "Nosotros", "Contacto"].map(
                (label) => (
                  <a
                    key={label}
                    href={`#${label === "Inicio" ? "hero" : label === "Nosotros" ? "nosotros" : label.toLowerCase()}`}
                    className="block text-sm text-gray-400 hover:text-violet-400 transition-colors"
                  >
                    {label}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-white font-semibold font-heading mb-4">Ubicación</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-violet-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">Mendoza</p>
                  <p className="text-xs text-gray-400">Salta 1577, Capital, Mendoza</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">Horarios</p>
                  <p className="text-xs text-gray-400">L a V: 10:00 a 17:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold font-heading mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-violet-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">+54 9 261 418-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-cyan-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">tecnoshowargentina@hotmail.com</span>
              </div>
              <a
                href="https://wa.me/5492614189999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-sm font-medium hover:bg-[#25D366]/20 transition-all"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} TecnoShow. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-500">
            Mendoza, Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
