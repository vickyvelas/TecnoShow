"""Genera una página HTML real por producto en public/p/<slug>/index.html y el sitemap con todas,
para que Google pueda encontrar cada producto (la tienda usa #, que Google no indexa).
Corre solo en cada deploy (prebuild). Saca los productos marcados ELIMINAR en la planilla.
Uso: python3 scripts/paginas_producto.py"""
import json, os, re, unicodedata, html, urllib.request
D = os.path.dirname(os.path.abspath(__file__)); PUB = os.path.join(D, '..', 'public'); OUT = os.path.join(PUB, 'p')
SITE = 'https://tecnoshow.vercel.app'; WA = '5492614189999'
os.makedirs(OUT, exist_ok=True)
cat = json.load(open(os.path.join(PUB, 'catalogo-ml.json')))
ocultos = set()
try:
    filas = json.load(urllib.request.urlopen('https://opensheet.elk.sh/1JwkT3fv9DmZi4esw3Fw6sgc71hg-1xOS4gS__yxFBsc/1', timeout=20))
    for f in filas:
        if any(re.match(r'^(stock|ocultar|eliminar|estado)$', k.strip(), re.I) and
               re.match(r'^(eliminar|eliminado|borrar|ocultar|oculto)$', str(v).strip(), re.I) for k, v in f.items()):
            ocultos.add(str(f.get('sku', '')).strip())
except Exception:
    pass

def slug(t):
    t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', t)).strip('-')[:70].rstrip('-') or 'producto'

def precio(n): return '$ ' + f'{int(n):,}'.replace(',', '.')

E = html.escape
usados, urls = set(), []
for x in cat:
    if not x.get('nombre') or x['sku'] in ocultos: continue
    s = slug(x['nombre'])
    if s in usados: s = s + '-' + x['sku'].lower()
    usados.add(s)
    p = int(float(x.get('precio') or 0)); stock = x.get('stock', 'Sí') != 'No'
    imgs = [u for u in re.split(r'[\s,]+', x.get('imagenes', '')) if u.startswith('http')][:6]
    desc = (x.get('descripcion') or '').strip()
    corta = re.sub(r'\s+', ' ', desc)[:155] or f"{x['nombre']} en TecnoShow Mendoza. Garantía 30 días, envíos a todo el país, cuotas."
    attrs = [a.split(':', 1) for a in (x.get('caracteristicas') or '').split(' | ') if ':' in a]
    ld = {"@context": "https://schema.org", "@type": "Product", "name": x['nombre'], "image": imgs, "description": corta,
          "sku": x['sku'], "offers": {"@type": "Offer", "priceCurrency": "ARS", "price": p, "url": f"{SITE}/p/{s}/",
          "availability": "https://schema.org/" + ("InStock" if stock else "OutOfStock"), "seller": {"@type": "Organization", "name": "TecnoShow"}}}
    if x.get('marca'): ld['brand'] = {"@type": "Brand", "name": x['marca']}
    msg = urllib.request.quote(f"Hola TecnoShow! Quería consultar por: {x['nombre']} ({x['sku']})")
    page = f"""<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(x['nombre'])} | TecnoShow Mendoza</title><meta name="description" content="{E(corta)}">
<link rel="canonical" href="{SITE}/p/{s}/"><meta property="og:title" content="{E(x['nombre'])}"><meta property="og:image" content="{E(imgs[0] if imgs else SITE + '/logo.png')}">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False).replace('</', '<\\/')}</script>
<style>body{{font-family:system-ui,sans-serif;margin:0;color:#1d1d1f;background:#fafafa}}main{{max-width:960px;margin:auto;padding:16px}}
header{{background:#111;padding:10px 16px}}header a{{color:#fff;font-weight:700;text-decoration:none}}.g{{display:flex;gap:8px;overflow-x:auto}}.g img{{height:260px;background:#fff;border-radius:8px}}
.pr{{font-size:28px;font-weight:700}}.tr{{color:#0a7d32}}.b{{display:inline-block;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:600;margin:6px 6px 0 0}}
.wa{{background:#25d366;color:#fff}}.st{{background:#111;color:#fff}}ul.c{{padding-left:18px}}table{{border-collapse:collapse;width:100%;background:#fff}}td,th{{border-bottom:1px solid #eee;padding:6px;text-align:left;font-size:14px}}pre{{white-space:pre-wrap;font:inherit}}</style>
</head><body><header><a href="/">TecnoShow</a></header><main>
<h1>{E(x['nombre'])}</h1><div class="g">{''.join(f'<img src="{E(u)}" alt="{E(x["nombre"])}" loading="lazy">' for u in imgs)}</div>
{f'<p class="pr">{precio(p)}</p><p class="tr">{precio(round(p * .9))} pagando por transferencia (10% OFF)</p>' if p and stock else '<p><b>Sin stock por ahora.</b> Consultanos por reingreso.</p>'}
<a class="b wa" href="https://wa.me/{WA}?text={msg}">Consultar por WhatsApp</a><a class="b st" href="/#{x['sku']}">Ver en la tienda</a>
<ul class="c"><li>Garantía 30 días</li><li>Envíos a todo el país: Correo Argentino, OCA, Vía Cargo o el que necesites</li><li>Todos los medios de pago y cuotas</li><li>Retiro en Salta 1577, Ciudad de Mendoza</li></ul>
{('<h2>Características</h2><table>' + ''.join(f'<tr><th>{E(k.strip())}</th><td>{E(v.strip())}</td></tr>' for k, v in attrs) + '</table>') if attrs else ''}
{f'<h2>Descripción</h2><pre>{E(desc)}</pre>' if desc else ''}
</main></body></html>"""
    os.makedirs(os.path.join(OUT, s), exist_ok=True); open(os.path.join(OUT, s, 'index.html'), 'w', encoding='utf-8').write(page)
    urls.append(f"{SITE}/p/{s}/")
with open(os.path.join(PUB, 'sitemap.xml'), 'w') as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    f.write(f'  <url><loc>{SITE}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n')
    f.writelines(f'  <url><loc>{u}</loc></url>\n' for u in urls)
    f.write('</urlset>\n')
print(len(urls), 'páginas de producto')
