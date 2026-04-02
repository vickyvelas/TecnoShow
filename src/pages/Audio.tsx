import { Volume2 } from "lucide-react";
import CategoryPage from "../components/CategoryPage";

export default function Audio() {
  return (
    <CategoryPage
      categoria="audio"
      titulo="Audio"
      subtitulo="Profesional"
      icono={<Volume2 size={28} className="text-white" />}
      gradiente="from-violet-500 to-purple-600"
    />
  );
}
