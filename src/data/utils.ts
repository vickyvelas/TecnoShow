import type { Producto } from "./products";

export type { Producto };

export const categoriaNombres: Record<string, string> = {
  audio: "Audio",
  iluminacion: "Iluminación",
  video: "Video",
  accesorios: "Accesorios",
  otros: "Otros",
};

export const subcategoriaNombres: Record<string, string> = {
  parlantes: "Parlantes",
  consolas: "Consolas",
  mixers: "Mixers",
  microfonos: "Micrófonos",
  amplificadores: "Amplificadores",
  "cajas-directas": "Cajas Directas",
  procesadores: "Procesadores",
  accesorios: "Accesorios de Audio",
  auriculares: "Auriculares",
  "equipos-dj": "Equipos DJ",
  "luces-led": "Luces LED",
  "cabezas-moviles": "Cabezas Móviles",
  strobo: "Strobo",
  "maquinas-humo": "Máquinas de Humo",
  lazeres: "Láseres",
  efectos: "Efectos",
  "barras-led": "Barras LED",
  "pantallas-led": "Pantallas LED",
  proyectores: "Proyectores",
  camaras: "Cámaras",
  soportes: "Soportes",
  fundas: "Fundas y Cases",
  baterias: "Baterías y Pilas",
  general: "General",
};

export function getCategorias(productos: Producto[]): string[] {
  return [...new Set(productos.map((p) => p.categoria))].filter((c) => c !== "otros");
}

export function getSubcategorias(productos: Producto[], categoria: string): string[] {
  return [
    ...new Set(
      productos.filter((p) => p.categoria === categoria).map((p) => p.subcategoria)
    ),
  ];
}

export function filtrarProductos(
  productos: Producto[],
  filtros: {
    categoria?: string;
    subcategoria?: string;
    busqueda?: string;
    precioMin?: number;
    precioMax?: number;
  }
): Producto[] {
  return productos.filter((p) => {
    if (filtros.categoria && p.categoria !== filtros.categoria) return false;
    if (filtros.subcategoria && p.subcategoria !== filtros.subcategoria) return false;
    if (filtros.busqueda) {
      const busq = filtros.busqueda.toLowerCase();
      if (!p.nombre.toLowerCase().includes(busq) && !p.descripcion.toLowerCase().includes(busq)) {
        return false;
      }
    }
    if (filtros.precioMin && (p.precio || 0) < filtros.precioMin) return false;
    if (filtros.precioMax && (p.precio || 0) > filtros.precioMax) return false;
    return true;
  });
}

export function formatearPrecio(precio: number | null): string {
  if (!precio) return "Consultar precio";
  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  });
}
