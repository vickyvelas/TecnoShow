"""Genera public/catalogo-meta.csv: catálogo para Meta Commerce Manager (WhatsApp, Instagram, Facebook).
Toma hasta 500 productos con stock (límite de WhatsApp), primero las categorías principales.
Uso: python3 scripts/feed_meta.py"""
import csv, json, os, re
R = os.path.join(os.path.dirname(__file__), '..', 'public')
rows = json.load(open(os.path.join(R, 'catalogo-ml.json')))
PRIORIDAD = ["Parlantes y amplificación", "Iluminación", "Auriculares", "DJ y consolas", "Máquinas de humo",
             "Micrófonos", "Video y pantallas", "Instrumentos", "Soportes, fundas y estructuras",
             "Cables y conectores", "Electrónica y repuestos", "Accesorios", "Otros"]
def num(v):
    try: return float(re.sub(r'[^\d.]', '', str(v)) or 0)
    except ValueError: return 0
ok = [r for r in rows if r.get('stock') == 'Sí' and num(r.get('precio')) > 0 and r.get('imagenes')]
ok.sort(key=lambda r: (PRIORIDAD.index(r['categoria']) if r.get('categoria') in PRIORIDAD else 99, -num(r.get('vendidos')), -num(r.get('precio'))))
ok = ok[:500]
jpg = lambda u: u.strip().replace('-F.webp', '-F.jpg')
with open(os.path.join(R, 'catalogo-meta.csv'), 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f)
    w.writerow(['id', 'title', 'description', 'availability', 'condition', 'price', 'link', 'image_link',
                'additional_image_link', 'brand', 'product_type'])
    for r in ok:
        imgs = [jpg(u) for u in r['imagenes'].split(',') if u.strip()]
        desc = (r.get('descripcion') or r['nombre']).strip()
        desc = re.sub(r'\s+\n', '\n', desc)[:4900]
        w.writerow([r['sku'], r['nombre'].strip()[:150], desc, 'in stock', 'new', f"{num(r['precio']):.2f} ARS",
                    f"https://tecnoshow.vercel.app/#{r['sku']}", imgs[0], ','.join(imgs[1:10]),
                    (r.get('marca') or 'TecnoShow').strip()[:100], r.get('categoria', '')])
print(len(ok), 'productos en catalogo-meta.csv')
