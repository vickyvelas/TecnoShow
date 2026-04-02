import { Lightbulb } from "lucide-react";
import CategoryPage from "../components/CategoryPage";

export default function Iluminacion() {
  return (
    <CategoryPage
      categoria="iluminacion"
      titulo="Iluminación"
      subtitulo="Profesional"
      icono={<Lightbulb size={28} className="text-white" />}
      gradiente="from-cyan-400 to-blue-500"
    />
  );
}
