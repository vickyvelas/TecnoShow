import { motion } from "framer-motion";
import { ChevronDown, Sparkles, ShoppingCart, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Hero background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&q=80"
          alt="Equipos de audio profesional"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark-950/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/85 to-dark-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/10 to-cyan-900/10" />
      </div>

      {/* Animated grid */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,92,246,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl"
      />
      <motion.div
        animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm mb-8"
        >
          <Sparkles size={16} className="text-cyan-400" />
          <span className="text-sm text-gray-200">Distribuidores oficiales en Cuyo · +25 años de trayectoria</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-heading mb-6 leading-tight"
        >
          <span style={{background: "linear-gradient(to right, #ffffff, #ddd6fe, #ffffff)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent"}}>
            Tecno
          </span>
          <span style={{background: "linear-gradient(to right, #a78bfa, #22d3ee, #a78bfa)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent", animation: "gradient-shift 8s ease infinite"}}>
            Show
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto font-light"
        >
          Venta e instalación de audio, iluminación{" "}
          <span className="text-cyan-400 font-medium">y pantallas LED profesionales</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-10"
        >
          <MapPin size={14} className="text-violet-400" />
          <span>Local en Mendoza · Envíos a todo el país</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#contacto"
            className="group relative px-8 py-4 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-white flex items-center gap-2">
              <ShoppingCart size={20} />
              Solicitar Presupuesto
            </span>
          </a>
          <a
            href="#productos"
            className="group px-8 py-4 rounded-full font-semibold text-lg border border-white/20 text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
          >
            Ver Productos
          </a>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {["Audio profesional", "Iluminación LED", "Pantallas LED", "Consolas de mezcla", "Microfonía", "Instalaciones fijas"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium bg-dark-800/60 border border-white/10 text-gray-400 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {[
            { value: "25+", label: "Años de experiencia" },
            { value: "2000+", label: "Ventas realizadas" },
            { value: "50+", label: "Marcas oficiales" },
            { value: "6m", label: "Garantía escrita" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold" style={{background: "linear-gradient(to right, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent"}}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#productos"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 hover:text-violet-400 transition-colors flex flex-col items-center gap-1"
      >
        <span className="text-xs">Scroll</span>
        <ChevronDown size={20} />
      </motion.a>
    </section>
  );
}
