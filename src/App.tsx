import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Audio from "./pages/Audio";
import Iluminacion from "./pages/Iluminacion";
import Video from "./pages/Video";
import Productos from "./pages/Productos";
import ContactoPage from "./pages/ContactoPage";
import Accesorios from "./pages/Accesorios"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/audio" element={<Audio />} />
          <Route path="/iluminacion" element={<Iluminacion />} />
          <Route path="/video" element={<Video />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/accesorios" element={<Accesorios />} />
          <Route path="/contacto" element={<ContactoPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
