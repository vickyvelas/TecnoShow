import { useState, useEffect } from "react";

export interface ProductoSheet {
  sku: string;
  nombre: string;
  precio: string;
  marca: string;
  categoria: string;
  subcategoria: string;
  stock: string;
  imagenes: string;
  descripcion: string;
}

export interface Producto {
  id: string;
  nombre: string;
  precio: number | null;
  marca: string;
  categoria: string;
  subcategoria: string;
  stock: string;
  imagenes: string[];
  descripcion: string;
}

const ENDPOINT =
  "https://opensheet.elk.sh/1JkdHHbBojA0vDSJO4zkQVbrexuAQKFKWfBPeisP25l4/productos";

const imagenesPorCategoria: Record<string, string[]> = {
  audio: [
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80",
    "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80",
  ],
  iluminacion: [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
  ],
  video: [
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=80",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&q=80",
  ],
  otros: [
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80",
  ],
};

function obtenerImagenDefault(categoria: string, index: number): string {
  const imgs = imagenesPorCategoria[categoria] || imagenesPorCategoria.otros;
  return imgs[index % imgs.length];
}

function convertirGoogleDriveUrl(url: string): string {
  if (!url) return url;

  let fileId = "";

  const matchFile = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile) fileId = matchFile[1];

  if (!fileId) {
    const matchOpen = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchOpen) fileId = matchOpen[1];
  }

  if (!fileId) {
    const matchUc = url.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/);
    if (matchUc) fileId = matchUc[1];
  }

  if (fileId) {
    // Usar imagen local si existe en /public/productos/
    if (IMAGENES_LOCALES[fileId]) {
      return IMAGENES_LOCALES[fileId];
    }
    // Fallback: formato thumbnail de Google Drive
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`;
  }

  return url;
}

// Mapeo de file IDs de Drive a imágenes locales descargadas
const IMAGENES_LOCALES: Record<string, string> = {
  "1o7Ky3H5L0wjTrDzRBD125rqrWL9lk6TS": "/productos/dicroica-rgb/1.jpg",
  "1oVqchlAYhQ9NyCJHcELfDEuVh0g3F_3B": "/productos/dicroica-rgb/2.jpg",
  "1QP4AkAEWpybMxnKjOf2b1OoxjvG_iver": "/productos/dicroica-rgb/3.jpg",
  "1cX_eYZOQY8fvtovzAE2kXdZYPoy5uCcW": "/productos/dicroica-rgb/4.jpg",
  "1fvVHjhCjwPjs3mr-RTs23vExQ1ruoUyU": "/productos/dicroica-rgb/5.jpg",
};

function transformarProducto(raw: ProductoSheet, index: number): Producto {
  let imagenes: string[] = [];
  if (raw.imagenes && raw.imagenes.trim()) {
    imagenes = raw.imagenes
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.startsWith("http"))
      .map(convertirGoogleDriveUrl);
  }

  if (imagenes.length === 0) {
    imagenes = [obtenerImagenDefault(raw.categoria?.toLowerCase() || "otros", index)];
  }

  const precioStr = (raw.precio || "").replace(/[^0-9.,]/g, "").replace(/\./g, "").replace(",", ".");
  const precio = parseFloat(precioStr);
  const cat = (raw.categoria || "otros").toLowerCase().trim();

  // Manejar subcategorias con formato "categoria - subcategoria" o solo "subcategoria"
  let sub = (raw.subcategoria || "general").toLowerCase().trim();
  if (sub.includes(" - ")) {
    sub = sub.split(" - ").pop()?.trim() || sub;
  }
  sub = sub.replace(/\s+/g, "-");

  return {
    id: raw.sku || `prod-${index}`,
    nombre: raw.nombre || "Producto",
    precio: isNaN(precio) ? null : precio,
    marca: raw.marca || "",
    categoria: cat,
    subcategoria: sub,
    stock: raw.stock || "",
    imagenes,
    descripcion: raw.descripcion || "",
  };
}

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductos() {
      try {
        setLoading(true);
        const res = await fetch(ENDPOINT);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: ProductoSheet[] = await res.json();
        const transformados = data
          .filter((p) => p.nombre)
          .map((raw, i) => transformarProducto(raw, i));
        setProductos(transformados);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, []);

  const categorias = [...new Set(productos.map((p) => p.categoria))].filter(
    (c) => c && c !== "otros"
  );

  const getSubcategorias = (categoria: string) =>
    [...new Set(productos.filter((p) => p.categoria === categoria).map((p) => p.subcategoria))];

  const getByCategoria = (categoria: string) =>
    productos.filter((p) => p.categoria === categoria);

  return { productos, loading, error, categorias, getSubcategorias, getByCategoria };
}

export const categoriaNombres: Record<string, string> = {
  audio: "Audio",
  iluminacion: "Iluminación",
  video: "Video",
  accesorios: "Accesorios",
};
