import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Users, Zap, Shield, CheckCircle2, Star, ArrowRight, Building2, Wrench } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "+25 Años de Experiencia",
    description: "Empresa líder en Cuyo con más de 25 años en asesoramiento, ventas y servicio post venta.",
  },
  {
    icon: Users,
    title: "Asesoramiento Técnico",
    description: "Te ayudamos a elegir el equipamiento ideal según tu espacio, presupuesto y necesidad.",
  },
  {
    icon: Zap,
    title: "Marcas Oficiales",
    description: "Distribuidores oficiales de las mejores marcas internacionales de audio e iluminación.",
  },
  {
    icon: Shield,
    title: "Garantía Escrita",
    description: "Todos nuestros productos con garantía escrita de 6 meses y factura A o B.",
  },
];

const stats = [
  { value: "25+", label: "Años de trayectoria" },
  { value: "1M+", label: "Ventas realizadas" },
  { value: "50+", label: "Marcas oficiales" },
  { value: "1", label: "Local (Mendoza)" },
];

const highlights = [
  "Distribuidores oficiales de las mejores marcas del mundo",
  "Asesoramiento técnico personalizado para tu espacio",
  "Diseño, instalación y mantenimiento profesional",
  "Local en Mendoza para ver los productos funcionando",
  "Garantía escrita de 6 meses y factura oficial",
  "Envíos a todo el país por Mercado Envíos",
];

const marcas = [
  "QSC", "Shure", "Behringer", "JBL", "Yamaha", "RCF",
  "Allen & Heath", "Denon", "Mackie", "Midas", "Turbosound",
  "DB Technologies", "DAS Audio", "Powersoft", "Lab Gruppen",
  "Proel", "Samson", "Phonic", "Antari", "Neutrik",
];

const usos = [
  "Salones de fiestas",
  "Boliches y discotecas",
  "Iglesias y templos",
  "Restaurantes y bares",
  "Eventos corporativos",
  "Estudios de grabación",
  "Teatros y auditorios",
  "Festivales al aire libre",
];

export default function SobreNosotros() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="nosotros" className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-violet-600/5 blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-cyan-400 border border-cyan-400/20 bg-cyan-400/5 mb-4">
            SOBRE NOSOTROS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white mb-4">
            Empresa líder en{" "}
            <span style={{background: "linear-gradient(to right, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent"}}>
              Cuyo
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative rounded-2xl overflow-hidden mb-8 group">
              <img
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80"
                alt="Showroom TecnoShow"
                className="w-full h-64 sm:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-sm text-white font-medium">Showrooms en Cuyo</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-white">Líder en Cuyo</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Somos la <strong className="text-white">empresa líder en Cuyo</strong> con más de
                25 años de experiencia en asesoramiento, ventas y servicio post venta
                del mercado de audio, sonido, iluminación y pantallas LED.
              </p>
              <p>
                Nuestra misión es mantener y mejorar este liderazgo ofreciendo no solo
                productos de alta calidad, sino también diseño, realización de
                instalaciones y mantenimiento, logrando abarcar casi todas las áreas
                que el mercado exige, con altos niveles de calidad y compromiso.
              </p>
              <p>
                Contamos con local comercial en <strong className="text-white">Mendoza (Salta 1577)</strong>,{" "}
                y realizamos envíos personalizados a San Juan y San Luis, además de envíos a todo el país.
                y realizamos envíos a todo el país.
              </p>
            </div>

            {/* Usos / ideal para */}
            <div className="mt-6 p-5 rounded-xl bg-dark-800/50 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Wrench size={16} className="text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Ideal para sonido e iluminación de:</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {usos.map((uso) => (
                  <span key={uso} className="px-2.5 py-1 rounded-lg bg-dark-700/50 border border-white/5 text-gray-300 text-xs">
                    {uso}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105"
              >
                Contactanos
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl bg-dark-800/50 border border-white/5">
              <h3 className="text-lg font-bold font-heading text-white mb-4">
                ¿Por qué elegirnos?
              </h3>
              <div className="space-y-3">
                {highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="p-5 rounded-xl bg-dark-800/50 border border-white/5 hover:border-violet-500/20 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600/20 to-cyan-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <feature.icon size={20} className="text-violet-400" />
                  </div>
                  <h4 className="font-bold text-white mb-1 font-heading text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Brands */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Building2 size={18} className="text-violet-400" />
            <h3 className="text-lg font-bold font-heading text-white">
              Distribuidores oficiales de las mejores marcas
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {marcas.map((marca) => (
              <span
                key={marca}
                className="px-3 py-1.5 rounded-lg bg-dark-800/60 border border-white/5 text-gray-400 text-xs font-medium hover:border-violet-500/20 hover:text-white transition-all"
              >
                {marca}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-2xl bg-gradient-to-r from-violet-600/10 to-cyan-500/10 border border-violet-500/10"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold" style={{background: "linear-gradient(to right, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent"}}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
