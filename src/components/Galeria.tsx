import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

const galleryItems = [
  {
    id: 1,
    title: "Show de Luces LED",
    category: "Iluminación",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
  },
  {
    id: 2,
    title: "Escenario Principal",
    category: "Producción",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
  },
  {
    id: 3,
    title: "Sistema de Audio Line Array",
    category: "Audio",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
  },
  {
    id: 4,
    title: "Pantalla LED Gigante",
    category: "Video",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
  },
  {
    id: 5,
    title: "DJ Set en Vivo",
    category: "Shows",
    image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
  },
  {
    id: 6,
    title: "Láser Show",
    category: "Iluminación",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  },
  {
    id: 7,
    title: "Evento Corporativo",
    category: "Producción",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  },
  {
    id: 8,
    title: "Festival al Aire Libre",
    category: "Shows",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
  },
  {
    id: 9,
    title: "Microfonía Profesional",
    category: "Audio",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80",
  },
  {
    id: 10,
    title: "Luces de Boliches",
    category: "Iluminación",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
  },
  {
    id: 11,
    title: "Recital en Vivo",
    category: "Shows",
    image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80",
  },
  {
    id: 12,
    title: "Streaming Multicam",
    category: "Video",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
  },
];

const categories = ["Todos", "Iluminación", "Audio", "Video", "Producción", "Shows"];

export default function Galeria() {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState("Todos");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filtered =
    filter === "Todos"
      ? galleryItems
      : galleryItems.filter((item) => item.category === filter);

  const selectedItem = galleryItems.find((i) => i.id === selected);
  const selectedIndex = filtered.findIndex((i) => i.id === selected);

  const goNext = () => {
    if (selectedIndex < filtered.length - 1) {
      setSelected(filtered[selectedIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (selectedIndex > 0) {
      setSelected(filtered[selectedIndex - 1].id);
    }
  };

  return (
    <section id="galeria" className="relative py-24 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-violet-400 border border-violet-400/20 bg-violet-400/5 mb-4">
            GALERÍA
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white mb-4">
            Momentos que{" "}
            <span style={{background: "linear-gradient(to right, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent"}}>
              creamos
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-8">
            Una muestra de nuestros eventos y producciones más destacados.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  filter === cat
                    ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/20"
                    : "bg-dark-800/60 text-gray-300 border border-white/10 hover:border-violet-500/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              layout
              onClick={() => setSelected(item.id)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/3] bg-dark-800"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
                  <ZoomIn size={22} className="text-white" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-xs text-cyan-400 font-medium bg-cyan-400/10 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
                <h4 className="text-white font-semibold text-sm mt-2">
                  {item.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected !== null && selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors z-10"
            >
              <X size={28} />
            </button>

            {/* Nav arrows */}
            {selectedIndex > 0 && (
              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-violet-600/50 rounded-full p-2 text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            {selectedIndex < filtered.length - 1 && (
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-violet-600/50 rounded-full p-2 text-white transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            )}

            <div className="rounded-2xl overflow-hidden">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full aspect-video object-cover"
              />
              <div className="p-4 bg-dark-900">
                <span className="text-xs text-cyan-400 font-medium">
                  {selectedItem.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedItem.title}
                </h3>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
