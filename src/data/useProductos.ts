import { useEffect, useState } from "react";

/* =========================================================
   DATOS DE PRODUCTOS
   - Pestaña "productos": la llena el formulario de Google.
   - Pestaña "mercadolibre": los productos de Mercado Libre que querés editar a mano.
   - /catalogo-ml.json: copia de Mercado Libre que se actualiza sola todos los días.
   ========================================================= */

const SHEET_ID = "1JkdHHbBojA0vDSJO4zkQVbrexuAQKFKWfBPeisP25l4";
const ENDPOINT_FORM = `https://opensheet.elk.sh/${SHEET_ID}/productos`;
const ENDPOINT_ML = `https://opensheet.elk.sh/${SHEET_ID}/mercadolibre`;
const RESPALDO_ML = "/catalogo-ml.json";

export const WHATSAPP = "5492614189999";
export const CANAL_WHATSAPP = "https://whatsapp.com/channel/0029VbD5UeP3WHTWDNI92c2L";
export const INSTAGRAM = "https://www.instagram.com/tecnoshowarg/";
export const RESENA_GOOGLE = "https://search.google.com/local/writereview?placeid=ChIJR26k8CEJfpYRD_7q823Gb1I";
export const MAPA = "https://www.google.com/maps/search/?api=1&query=Tecnoshow%20Salta%201577%20Mendoza&query_place_id=ChIJR26k8CEJfpYRD_7q823Gb1I";

type Fila = Record<string, string | number | undefined>;

export interface Producto {
  id: string;
  nombre: string;
  precio: number | null;
  precioAnterior: number | null;
  marca: string;
  categoria: string;
  subcategoria: string;
  stock: string;
  enStock: boolean;
  imagenes: string[];
  descripcion: string;
  caracteristicas: { clave: string; valor: string }[];
  link: string;
  vendidos: number;
  calificacion: number;
  busqueda: string;
}

/* Orden de las categorías en la página */
export const CATEGORIAS = [
  "Iluminación",
  "Parlantes y amplificación",
  "Micrófonos",
  "DJ y consolas",
  "Video y pantallas",
  "Cables y conectores",
  "Auriculares",
  "Instrumentos",
  "Electrónica y repuestos",
  "Accesorios",
  "Otros",
];

/* Grupos del menú (Audio, Iluminación, Video, Accesorios) */
export const GRUPOS: Record<string, { nombre: string; categorias: string[] }> = {
  audio: { nombre: "Audio", categorias: ["Parlantes y amplificación", "Micrófonos", "Auriculares", "DJ y consolas"] },
  iluminacion: { nombre: "Iluminación", categorias: ["Iluminación"] },
  video: { nombre: "Video", categorias: ["Video y pantallas"] },
  accesorios: { nombre: "Accesorios", categorias: ["Cables y conectores", "Accesorios", "Electrónica y repuestos", "Instrumentos", "Otros"] },
};

export const normalizar = (s: string) =>
  String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const REGLAS: [string, string[]][] = [
  ["Video y pantallas", ["pantalla", "video", "proyector", "camara", "tv"]],
  ["Iluminación", ["luz", "luces", "led", "laser", "foco", "lampara", "iluminacion", "strobo", "humo", "burbuja", "cabeza", "cabezal", "par ", "esfera", "bola"]],
  ["Micrófonos", ["microfono", "microfonia"]],
  ["Auriculares", ["auricular"]],
  ["DJ y consolas", ["consola", "mixer", "mezcladora", "dj", "controlador", "interfaz", "bandeja"]],
  ["Parlantes y amplificación", ["parlante", "bafle", "baffle", "amplificador", "potencia", "driver", "subwoofer", "monitor", "crossover", "ecualizador"]],
  ["Cables y conectores", ["cable", "conector", "ficha", "plug", "adaptador", "canon", "xlr"]],
  ["Instrumentos", ["guitarra", "bateria musical", "teclado", "platillo"]],
];

function categoriaDeFormulario(cat: string, sub: string, nombre: string): string {
  const texto = normalizar(`${sub} ${nombre}`);
  for (const [c, claves] of REGLAS) if (claves.some((k) => texto.includes(k))) return c;
  const c = normalizar(cat);
  if (c.startsWith("audio")) return "Parlantes y amplificación";
  if (c.startsWith("ilumin")) return "Iluminación";
  if (c.startsWith("video")) return "Video y pantallas";
  if (c.startsWith("acces")) return "Accesorios";
  return "Otros";
}

function subcategoriaLegible(sub: string): string {
  let s = String(sub || "").trim();
  if (s.includes(" - ")) s = s.split(" - ").pop()!.trim();
  s = s.replace(/-/g, " ");
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

/* Links de Google Drive -> imagen que se puede mostrar */
const IMAGENES_LOCALES: Record<string, string> = {
  "1o7Ky3H5L0wjTrDzRBD125rqrWL9lk6TS": "/productos/dicroica-rgb/1.jpg",
  "1oVqchlAYhQ9NyCJHcELfDEuVh0g3F_3B": "/productos/dicroica-rgb/2.jpg",
  "1QP4AkAEWpybMxnKjOf2b1OoxjvG_iver": "/productos/dicroica-rgb/3.jpg",
  "1cX_eYZOQY8fvtovzAE2kXdZYPoy5uCcW": "/productos/dicroica-rgb/4.jpg",
  "1fvVHjhCjwPjs3mr-RTs23vExQ1ruoUyU": "/productos/dicroica-rgb/5.jpg",
};
function convertirImagen(url: string): string {
  const m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/) || url.match(/drive\.google\.com\/.*[?&]id=([\w-]+)/);
  if (m) return IMAGENES_LOCALES[m[1]] || `https://drive.google.com/thumbnail?id=${m[1]}&sz=w800`;
  return url;
}

function numero(v: unknown): number | null {
  const s = String(v ?? "").replace(/[^0-9.,]/g, "").replace(/\./g, "").replace(",", ".");
  const n = parseFloat(s);
  return isNaN(n) || n <= 0 ? null : Math.round(n);
}

function hayStock(v: unknown): boolean {
  const s = normalizar(String(v ?? "")).trim();
  if (!s) return true;
  if (/^(0|no|sin stock|agotado|consultar)$/.test(s)) return false;
  const n = parseFloat(s);
  return isNaN(n) ? true : n > 0;
}

function aProducto(f: Fila, origen: "form" | "ml", i: number): Producto | null {
  const g = (k: string) => String(f[k] ?? "").trim();
  const nombre = g("nombre");
  if (!nombre) return null;
  const imagenes = g("imagenes").split(/[\s,]+/).filter((s) => s.startsWith("http")).map(convertirImagen);
  const categoria = origen === "ml" && CATEGORIAS.includes(g("categoria"))
    ? g("categoria")
    : categoriaDeFormulario(g("categoria"), g("subcategoria"), nombre);
  const caracteristicas = g("caracteristicas")
    .split(/\s*\|\s*|\n/)
    .map((x) => { const k = x.indexOf(":"); return k > 0 ? { clave: x.slice(0, k).trim(), valor: x.slice(k + 1).trim() } : null; })
    .filter(Boolean) as { clave: string; valor: string }[];
  const marca = g("marca");
  if (marca && !caracteristicas.some((c) => normalizar(c.clave) === "marca")) caracteristicas.unshift({ clave: "Marca", valor: marca });
  const precio = numero(g("precio"));
  const anterior = numero(g("precio_anterior"));
  const p: Producto = {
    id: g("sku") || `prod-${origen}-${i}`,
    nombre,
    precio,
    precioAnterior: anterior && precio && anterior > precio ? anterior : null,
    marca,
    categoria,
    subcategoria: subcategoriaLegible(g("subcategoria")) || categoria,
    stock: g("stock"),
    enStock: hayStock(g("stock")),
    imagenes,
    descripcion: g("descripcion"),
    caracteristicas,
    link: g("link"),
    vendidos: Number(g("vendidos")) || 0,
    calificacion: Number(g("calificacion")) || 0,
    busqueda: "",
  };
  p.busqueda = normalizar([p.nombre, p.marca, p.categoria, p.subcategoria, p.id].join(" "));
  return p;
}

async function traer(url: string): Promise<Fila[]> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Error ${r.status}`);
  const d = await r.json();
  if (!Array.isArray(d)) throw new Error("Formato inesperado");
  return d;
}

let cache: Promise<Producto[]> | null = null;
function cargar(): Promise<Producto[]> {
  if (cache) return cache;
  cache = (async () => {
    // 1) formulario  2) pestaña "mercadolibre" (lo que editás a mano)  3) copia automática de Mercado Libre.
    // Si un producto está en más de un lugar, gana el primero.
    const [form, mlPlanilla, mlAuto] = await Promise.all([
      traer(ENDPOINT_FORM).catch(() => [] as Fila[]),
      traer(ENDPOINT_ML).catch(() => [] as Fila[]),
      traer(RESPALDO_ML).catch(() => [] as Fila[]),
    ]);
    const lista: Producto[] = [];
    const vistos = new Set<string>();
    const sumar = (filas: Fila[], origen: "form" | "ml") =>
      filas.forEach((f, i) => { const p = aProducto(f, origen, i); if (p && !vistos.has(p.id)) { vistos.add(p.id); lista.push(p); } });
    sumar(form, "form");
    sumar(mlPlanilla, "ml");
    sumar(mlAuto, "ml");
    if (!lista.length) throw new Error("No se pudieron cargar los productos");
    return lista;
  })();
  cache.catch(() => { cache = null; });
  return cache;
}

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    cargar()
      .then((p) => { if (vivo) { setProductos(p); setError(null); } })
      .catch((e) => { if (vivo) setError((e as Error).message); })
      .finally(() => { if (vivo) setLoading(false); });
    return () => { vivo = false; };
  }, []);

  const categorias = CATEGORIAS.filter((c) => productos.some((p) => p.categoria === c));
  return { productos, loading, error, categorias };
}

export function formatearPrecio(precio: number | null): string {
  if (!precio) return "Consultar precio";
  return "$ " + precio.toLocaleString("es-AR");
}

export function linkWhatsApp(p?: Producto): string {
  const txt = p ? `Hola TecnoShow! Quería consultar por: ${p.nombre} (${p.id})` : "Hola TecnoShow! Quería hacer una consulta";
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt)}`;
}
