import { MonitorPlay } from "lucide-react";
import CategoryPage from "../components/CategoryPage";

export default function Video() {
  return (
    <CategoryPage
      categoria="video"
      titulo="Video"
      subtitulo="Profesional"
      icono={<MonitorPlay size={28} className="text-white" />}
      gradiente="from-violet-500 to-pink-500"
    />
  );
}
