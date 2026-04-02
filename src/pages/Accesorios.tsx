import { Settings } from "lucide-react";
import CategoryPage from "../components/CategoryPage";

export default function Accesorios() {
  return (
    <CategoryPage
      categoria="accesorios"
      titulo="Accesorios"
      subtitulo="Profesional"
      icono={<Settings size={28} className="text-white" />}
      gradiente="from-violet-500 to-purple-600"
    />
  );
}
