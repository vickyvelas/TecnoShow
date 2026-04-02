import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://listado.mercadolibre.com.ar/tecno-show";
const MAX_PRODUCTS = 50;
const MAX_PAGES = 5;
const OUTPUT_PATH = path.join(__dirname, "../src/data/products-raw.json");

interface RawProduct {
  id: string;
  nombre: string;
  precio: number | null;
  imagenes: string[];
  descripcion: string;
  caracteristicas: { clave: string; valor: string }[];
  stock: string | null;
  link: string;
  categoria: string;
  subcategoria: string;
}

function clasificarProducto(titulo: string): { categoria: string; subcategoria: string } {
  const t = titulo.toLowerCase();

  const reglas: { palabras: string[]; categoria: string; subcategoria: string }[] = [
    { palabras: ["parlante", "bafle", "speaker", "altavoz", "subwoofer", "monitor de escenario", "line array"], categoria: "audio", subcategoria: "parlantes" },
    { palabras: ["consola", "console"], categoria: "audio", subcategoria: "consolas" },
    { palabras: ["mixer", "mezclador", "mesa de mezcla"], categoria: "audio", subcategoria: "mixers" },
    { palabras: ["micrófono", "microfono", "microphone", "mic ", "inalambrico", "inalámbrico"], categoria: "audio", subcategoria: "microfonos" },
    { palabras: ["amplificador", "potencia", "amplifier"], categoria: "audio", subcategoria: "amplificadores" },
    { palabras: ["caja directa", "direct box", "di box", "di200", "di100", "di600"], categoria: "audio", subcategoria: "cajas-directas" },
    { palabras: ["procesador", "equalizador", "equalizer", "crossover", "feedback"], categoria: "audio", subcategoria: "procesadores" },
    { palabras: ["cable", "xlr", "plug", "adaptador", "ficha", "bornera", "conector"], categoria: "audio", subcategoria: "accesorios" },
    { palabras: ["auricular", "audifono", "headphone"], categoria: "audio", subcategoria: "auriculares" },
    { palabras: ["par led", "par54", "par36", "par 18", "wash led", "cabezal"], categoria: "iluminacion", subcategoria: "luces-led" },
    { palabras: ["cabeza móvil", "cabeza movil", "beam", "moving head", "spot"], categoria: "iluminacion", subcategoria: "cabezas-moviles" },
    { palabras: ["strobo", "strobe", "flash"], categoria: "iluminacion", subcategoria: "strobo" },
    { palabras: ["máquina de humo", "maquina de humo", "haze", "humo", "niebla", "fog", "mist"], categoria: "iluminacion", subcategoria: "maquinas-humo" },
    { palabras: ["láser", "laser", "laseres", "luvia de laser"], categoria: "iluminacion", subcategoria: "laseres" },
    { palabras: ["esfera", "bola de espejo", "mirror ball"], categoria: "iluminacion", subcategoria: "efectos" },
    { palabras: ["derby", "moonflower", "efecto led", "flower"], categoria: "iluminacion", subcategoria: "efectos" },
    { palabras: ["barra led", "pixel bar", "linear led"], categoria: "iluminacion", subcategoria: "barras-led" },
    { palabras: ["dicroica", "dicroico"], categoria: "iluminacion", subcategoria: "luces-led" },
    { palabras: ["pantalla led", "videowall", "pantalla gigante", "led panel"], categoria: "video", subcategoria: "pantallas-led" },
    { palabras: ["proyector", "projección", "projection"], categoria: "video", subcategoria: "proyectores" },
    { palabras: ["cámara", "camara", "camera", "filmadora"], categoria: "video", subcategoria: "camaras" },
    { palabras: ["dj", "controlador dj", "turntable", "cdj", "xdojoe", "xdj"], categoria: "audio", subcategoria: "equipos-dj" },
    { palabras: ["soporte", "trípode", "tripie", "stand", "barra"], categoria: "accesorios", subcategoria: "soportes" },
    { palabras: ["funda", "estuche", "case", "bolso", "bag"], categoria: "accesorios", subcategoria: "fundas" },
    { palabras: ["pila", "batería", "battery", "cargador"], categoria: "accesorios", subcategoria: "baterias" },
  ];

  for (const regla of reglas) {
    for (const palabra of regla.palabras) {
      if (t.includes(palabra)) {
        return { categoria: regla.categoria, subcategoria: regla.subcategoria };
      }
    }
  }

  return { categoria: "otros", subcategoria: "general" };
}

function limpiarPrecio(texto: string): number | null {
  if (!texto) return null;
  const limpio = texto.replace(/[^0-9.,]/g, "").replace(/\./g, "").replace(",", ".");
  const precio = parseFloat(limpio);
  return isNaN(precio) ? null : precio;
}

async function extraerLinksDelListado(page: puppeteer.Page): Promise<string[]> {
  const links: string[] = [];

  for (let pagina = 0; pagina < MAX_PAGES; pagina++) {
    console.log(`📄 Procesando página ${pagina + 1}...`);

    if (pagina > 0) {
      const nextUrl = `${BASE_URL}_Desde_${pagina * 48 + 1}`;
      try {
        await page.goto(nextUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
        await new Promise((r) => setTimeout(r, 2000));
      } catch {
        console.log(`  ⚠️ No se pudo cargar página ${pagina + 1}`);
        break;
      }
    } else {
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise((r) => setTimeout(r, 3000));
    }

    const pageLinks = await page.evaluate(() => {
      const anchors = document.querySelectorAll(
        ".ui-search-layout__item a.ui-search-link, .ui-search-layout__item a.poly-component__title, .ui-search-result__content a"
      );
      const urls: string[] = [];
      anchors.forEach((a) => {
        const href = (a as HTMLAnchorElement).href;
        if (href && href.includes("mercadolibre.com") && href.includes("MLA") && !urls.includes(href)) {
          urls.push(href);
        }
      });
      return urls;
    });

    console.log(`  → ${pageLinks.length} links encontrados`);
    links.push(...pageLinks);

    if (links.length >= MAX_PRODUCTS) break;
  }

  return [...new Set(links)].slice(0, MAX_PRODUCTS);
}

async function extraerDetalleProducto(
  page: puppeteer.Page,
  url: string,
  index: number
): Promise<RawProduct | null> {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await new Promise((r) => setTimeout(r, 1500));

    const data = await page.evaluate(() => {
      const getText = (sel: string) => {
        const el = document.querySelector(sel);
        return el ? el.textContent?.trim() || "" : "";
      };

      const titulo = getText("h1.ui-pdp-title") || getText("h1");

      const precioTexto =
        getText(".ui-pdp-price__second-line .andes-money-amount__fraction") ||
        getText(".andes-money-amount__fraction");

      const imagenes: string[] = [];
      document.querySelectorAll(".ui-pdp-gallery__figure img, .ui-pdp-image img").forEach((img) => {
        const src = (img as HTMLImageElement).src || (img as HTMLImageElement).dataset?.src;
        if (src && !src.includes("data:") && !src.includes("placeholder")) {
          imagenes.push(src.replace(/\-\w+\.(jpg|png|webp)/, ".$1"));
        }
      });

      const descripcion = getText(".ui-pdp-description__content") || getText("[class*='description'] p");

      const caracteristicas: { clave: string; valor: string }[] = [];
      document.querySelectorAll(".andes-table__row, tr").forEach((row) => {
        const cells = row.querySelectorAll("th, td, .andes-table__header, .andes-table__column");
        if (cells.length >= 2) {
          caracteristicas.push({
            clave: cells[0].textContent?.trim() || "",
            valor: cells[1].textContent?.trim() || "",
          });
        }
      });

      const stock =
        getText(".ui-pdp-buybox__quantity__available") ||
        getText("[class*='stock']") ||
        null;

      const id = window.location.href.match(/MLA-?(\d+)/)?.[0] || "";

      return { titulo, precioTexto, imagenes, descripcion, caracteristicas, stock, id };
    });

    if (!data.titulo) {
      console.log(`  ⚠️ [${index}] Sin título, salteando`);
      return null;
    }

    const { categoria, subcategoria } = clasificarProducto(data.titulo);

    return {
      id: data.id || `prod-${index}`,
      nombre: data.titulo,
      precio: limpiarPrecio(data.precioTexto),
      imagenes: [...new Set(data.imagenes)],
      descripcion: data.descripcion,
      caracteristicas: data.caracteristicas,
      stock: data.stock,
      categoria,
      subcategoria,
      link: url,
    };
  } catch (err) {
    console.log(`  ❌ [${index}] Error: ${(err as Error).message}`);
    return null;
  }
}

async function main() {
  console.log("🚀 Iniciando scraper de TecnoShow...\n");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-blink-features=AutomationControlled"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1280, height: 800 });

  console.log("🔍 Extrayendo links del listado...");
  const links = await extraerLinksDelListado(page);
  console.log(`\n✅ ${links.length} productos encontrados en el listado\n`);

  console.log("📦 Extrayendo detalles de productos...\n");
  const productos: RawProduct[] = [];

  for (let i = 0; i < links.length; i++) {
    console.log(`  [${i + 1}/${links.length}] Procesando...`);
    const producto = await extraerDetalleProducto(page, links[i], i + 1);
    if (producto) {
      productos.push(producto);
      console.log(`  ✅ ${producto.nombre.substring(0, 50)}... → ${producto.categoria}/${producto.subcategoria}`);
    }
  }

  await browser.close();

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(productos, null, 2));
  console.log(`\n🎉 Completado: ${productos.length} productos guardados en ${OUTPUT_PATH}`);

  const categorias = productos.reduce((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log("\n📊 Por categoría:");
  Object.entries(categorias).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count}`);
  });
}

main().catch(console.error);
