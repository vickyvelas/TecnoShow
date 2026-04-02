import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  Volume2,
  Lightbulb,
  MonitorPlay,
  Mic,
  ArrowRight,
  Cable,
  Headphones,
} from "lucide-react";

const productos = [
  {
    icon: Volume2,
    title: "Audio y Sonido",
    description:
      "Parlantes, amplificadores, procesadores, consolas de mezcla, subwoofers, monitores de escenario y todo en equipamiento de sonido profesional.",
    gradient: "from-violet-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80",
    marcas: "QSC, JBL, Behringer, RCF, Yamaha, Mackie, Turbosound",
  },
  {
    icon: Lightbulb,
    title: "Iluminación y Efectos",
    description:
      "Luces LED PAR, cabezas móviles, láser, strobes, máquinas de humo, esferas de espejos y efectos especiales para cualquier espacio.",
    gradient: "from-cyan-400 to-blue-500",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
    marcas: "Antari, Lite Puter, Proel, Moon, Big Dipper",
  },
  {
    icon: MonitorPlay,
    title: "Pantallas LED y Video",
    description:
      "Pantallas LED de alta resolución, videowalls y soluciones de video profesional para interiores y exteriores.",
    gradient: "from-violet-400 to-pink-500",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=80",
    marcas: "DB Technologies, DAS Audio, American Pro",
  },
  {
    icon: Mic,
    title: "Microfonía",
    description:
      "Micrófonos inalámbricos, de solapa, dinámicos y de condensador para voces, instrumentos, conferencias y karaoke.",
    gradient: "from-amber-500 to-orange-500",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80",
    marcas: "Shure, Mipro, JTS, Rode, Nady, Behringer",
  },
  {
    icon: Headphones,
    title: "Consolas y Mezcla",
    description:
      "Consolas de mezcla analógicas y digitales, interfaces de audio, procesadores de señal y controladores DJ.",
    gradient: "from-emerald-500 to-teal-500",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    marcas: "Allen & Heath, Midas, Yamaha, Denon, Numark, Tascam",
  },
  {
    icon: Cable,
    title: "Accesorios y Conectores",
    description:
      "Cables, fichas, conectores Neutrik, soportes, fundas y todos los accesorios para completar tu instalación.",
    gradient: "from-rose-500 to-red-500",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80",
    marcas: "Neutrik, CableLab, Proel, Adam Hall",
  },
];

function ProductoCard({
  producto,
  index,
}: {
  producto: (typeof productos)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative rounded-2xl bg-dark-800/50 border border-white/5 hover:border-violet-500/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={producto.image}
          alt={producto.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-dark-900/50 to-transparent" />
        <div
          className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${producto.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <producto.icon size={24} className="text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold font-heading text-white mb-2 group-hover:text-violet-300 transition-colors">
          {producto.title}
        </h3>
        <p className="text-gray-400 leading-relaxed text-sm mb-3">
          {producto.description}
        </p>
        <p className="text-xs text-gray-500 mb-4">
          <span className="text-violet-400 font-medium">Marcas:</span> {producto.marcas}
        </p>
        <a
          href="#contacto"
          className="inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-violet-400 transition-colors group/link"
        >
          Pedir presupuesto
          <ArrowRight
            size={16}
            className="group-hover/link:translate-x-1 transition-transform"
          />
        </a>
      </div>
    </motion.div>
  );
}

export default function Servicios() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="productos" className="relative py-24 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-cyan-400 border border-cyan-400/20 bg-cyan-400/5 mb-4">
            PRODUCTOS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white mb-4">
            Equipamiento profesional{" "}
            <span style={{background: "linear-gradient(to right, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent"}}>
              para tu espacio
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Distribuidores oficiales de las mejores marcas internacionales.
            Asesoramiento técnico, instalación y servicio post venta.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto, index) => (
            <ProductoCard key={producto.title} producto={producto} index={index} />
          ))}
        </div>

        {/* CTA extra */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105"
          >
            Solicitar presupuesto
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
