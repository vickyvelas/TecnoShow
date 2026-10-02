import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  MessageCircle,
  Clock,
  CreditCard,
  Building2,
  DollarSign,
} from "lucide-react";

const categorias = [
  "Audio (parlantes, amplificadores, consolas)",
  "Iluminación LED y efectos",
  "Pantallas LED",
  "Microfonía",
  "Accesorios y cables",
  "Instalación / mantenimiento",
  "Pack completo",
];

const finalidades = [
  "Salón de fiestas",
  "Boliche / discotheque",
  "Evento corporativo",
  "Iglesia / templo",
  "Restaurante / bar",
  "Estudio de grabación",
  "Teatro / auditorio",
  "Uso personal / hogar",
  "Otro",
];

export default function Contacto() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    categoria: "",
    finalidad: "",
    presupuesto: "",
    mensaje: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const texto = [
      "Hola TecnoShow! Quiero pedir un presupuesto.",
      `Nombre: ${formData.nombre}`,
      `Email: ${formData.email}`,
      formData.telefono && `Teléfono: ${formData.telefono}`,
      formData.categoria && `Producto: ${formData.categoria}`,
      formData.finalidad && `Para: ${formData.finalidad}`,
      formData.presupuesto && `Presupuesto estimado: ${formData.presupuesto}`,
      `Mensaje: ${formData.mensaje}`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/5492614189999?text=${encodeURIComponent(texto)}`, "_blank");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      categoria: "",
      finalidad: "",
      presupuesto: "",
      mensaje: "",
    });
  };

  return (
    <section id="contacto" className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--color-violet-700)_0%,_transparent_60%)] opacity-10" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-violet-600 border border-violet-200 bg-violet-50 mb-4">
            CONTACTO
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-4">
            Solicitá tu{" "}
            <span style={{background: "linear-gradient(to right, #1d8bff, #6f35f0)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent"}}>
              presupuesto
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Contanos qué necesitás, para qué espacio y te asesoramos con el equipamiento ideal.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Locations */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
              <h4 className="text-slate-900 font-semibold font-heading flex items-center gap-2">
                <Building2 size={18} className="text-violet-600" />
                Nuestro local
              </h4>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-violet-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-sm">Mendoza</h4>
                  <p className="text-slate-600 text-sm">Salta 1577, Capital Mendoza</p>
                  <p className="text-slate-500 text-xs mt-1">Enviamos a San Juan, San Luis y todo el país</p>
                </div>
              </div>
            </div>

            {/* Hours + contact */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} className="text-violet-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-sm">Horarios</h4>
                  <p className="text-slate-600 text-sm">Lunes a Viernes: 10:00 a 17:00</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-sm">Email</h4>
                  <p className="text-slate-600 text-sm">tecnoshowargentina@hotmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-violet-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-sm">Teléfono</h4>
                  <p className="text-slate-600 text-sm">+54 9 261 418-9999</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <CreditCard size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-sm">Formas de pago</h4>
                  <p className="text-slate-600 text-sm">Efectivo, Mercado Pago o débito</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <a
                href="https://wa.me/5492614189999?text=Hola!%20Quiero%20consultar%20por%20un%20producto"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-semibold hover:bg-[#25D366]/20 hover:scale-[1.02] transition-all duration-300"
              >
                <MessageCircle size={22} />
                Escribinos por WhatsApp
              </a>

              <a
                href="tel:+5492614189999"
                className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-600 font-semibold hover:bg-violet-600/20 hover:scale-[1.02] transition-all duration-300"
              >
                <Phone size={22} />
                Llamar ahora
              </a>

              <a
                href="https://listado.mercadolibre.com.ar/pagina/tecnoshowvelas/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-amber-600 font-semibold hover:bg-yellow-500/20 hover:scale-[1.02] transition-all duration-300"
              >
                Comprar en MercadoLibre
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6 font-heading">
                Pedir presupuesto
              </h3>

              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    <Phone size={14} className="inline mr-1" /> Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    placeholder="+54 261 ..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    <DollarSign size={14} className="inline mr-1" /> Presupuesto estimado
                  </label>
                  <input
                    type="text"
                    value={formData.presupuesto}
                    onChange={(e) =>
                      setFormData({ ...formData, presupuesto: e.target.value })
                    }
                    placeholder="Ej: $500.000"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Categoría de producto
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({ ...formData, categoria: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-white">Seleccionar...</option>
                    {categorias.map((t) => (
                      <option key={t} value={t} className="bg-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    ¿Para qué espacio / finalidad?
                  </label>
                  <select
                    value={formData.finalidad}
                    onChange={(e) =>
                      setFormData({ ...formData, finalidad: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-white">Seleccionar...</option>
                    {finalidades.map((t) => (
                      <option key={t} value={t} className="bg-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Mensaje *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.mensaje}
                  onChange={(e) =>
                    setFormData({ ...formData, mensaje: e.target.value })
                  }
                  placeholder="Contanos qué necesitás: tipo de producto, marca de preferencia, características del espacio (tamaño, capacidad), si necesitás instalación..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <Send size={18} />
                {submitted ? "Se abrió WhatsApp con tu consulta" : "Enviar consulta por WhatsApp"}
              </button>

              <p className="text-xs text-slate-500 text-center mt-4">
                También podés visitar nuestro local en Mendoza para ver los productos funcionando antes de comprar.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
