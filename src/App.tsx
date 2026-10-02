import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import ProductoPage from "./pages/ProductoPage";
import ContactoPage from "./pages/ContactoPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<ProductoPage />} />
          <Route path="/audio" element={<Navigate to="/productos?grupo=audio" replace />} />
          <Route path="/iluminacion" element={<Navigate to="/productos?grupo=iluminacion" replace />} />
          <Route path="/video" element={<Navigate to="/productos?grupo=video" replace />} />
          <Route path="/accesorios" element={<Navigate to="/productos?grupo=accesorios" replace />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
