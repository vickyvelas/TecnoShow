import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "../public/productos");
const ENDPOINT = "https://opensheet.elk.sh/1JkdHHbBojA0vDSJO4zkQVbrexuAQKFKWfBPeisP25l4/productos";

function extractFileId(url: string): string | null {
  let m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  m = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  return null;
}

async function downloadImage(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000) return false; // probablemente HTML de error
    fs.writeFileSync(dest, buf);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log("📥 Descargando imágenes de Google Drive...\n");

  const res = await fetch(ENDPOINT);
  const data = await res.json();

  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  let descargadas = 0;
  let errores = 0;

  for (const prod of data) {
    if (!prod.imagenes || !prod.sku) continue;

    const sku = prod.sku.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const urls = prod.imagenes.split(",").map((s: string) => s.trim()).filter((s: string) => s.startsWith("http"));

    const dir = path.join(PUBLIC_DIR, sku);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    for (let i = 0; i < urls.length; i++) {
      const fileId = extractFileId(urls[i]);
      if (!fileId) continue;

      const ext = ".jpg";
      const dest = path.join(dir, `${i + 1}${ext}`);

      if (fs.existsSync(dest)) {
        console.log(`  ⏭️  ${sku}/${i + 1}${ext} ya existe`);
        continue;
      }

      const dlUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      const ok = await downloadImage(dlUrl, dest);

      if (ok) {
        console.log(`  ✅ ${sku}/${i + 1}${ext}`);
        descargadas++;
      } else {
        console.log(`  ❌ ${sku}/${i + 1}${ext} - error`);
        errores++;
      }
    }
  }

  console.log(`\n✅ ${descargadas} imágenes descargadas, ${errores} errores`);
  console.log("📁 Guardadas en: public/productos/");
  console.log("\n💡 Copia los IDs de archivo y rutas para agregarlos a IMAGENES_LOCALES en useProductos.ts");
}

main().catch(console.error);
