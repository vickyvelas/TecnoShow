"""Suma a public/catalogo-ml.json los productos nuevos de Mercado Libre.

Uso: python3 scripts/agregar_nuevos.py activos.json [nuevos_detalle.json]
  activos.json: lista de {"sku","nombre","precio","precio_anterior"} de TODAS las
                publicaciones activas hoy (sale del listado de la tienda).
  nuevos_detalle.json (opcional): lista de {"sku","imagenes","descripcion",
                "caracteristicas","marca","link"} de los productos nuevos.
Imprime cuántos nuevos hay y qué SKUs faltan de detalle.
"""
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from categorias import cat, OVERRIDES

RUTA = os.path.join(os.path.dirname(__file__), '..', 'public', 'catalogo-ml.json')
cat_rows = json.load(open(RUTA))
por_sku = {r['sku']: r for r in cat_rows}
activos = json.load(open(sys.argv[1]))
detalle = {d['sku']: d for d in (json.load(open(sys.argv[2])) if len(sys.argv) > 2 else [])}

nuevos, sin_detalle, vuelven = [], [], []
for a in activos:
    sku = a['sku']
    if sku in por_sku:
        r = por_sku[sku]
        if r.get('stock') != 'Sí':
            vuelven.append(sku)
        r['stock'] = 'Sí'
        continue
    if sku not in detalle:
        sin_detalle.append(sku); continue
    d = detalle[sku]
    c = OVERRIDES.get(sku) or cat(a['nombre'])
    if c is None:  # "link de pago" u otras publicaciones que no son productos
        continue
    r = {'sku': sku, 'nombre': a['nombre'], 'precio': str(a.get('precio') or ''),
         'precio_anterior': str(a.get('precio_anterior') or ''), 'oferta': '', 'stock': 'Sí',
         'categoria': c[0] if isinstance(c, tuple) else c,
         'subcategoria': c[1] if isinstance(c, tuple) else '',
         'marca': d.get('marca', ''), 'imagenes': d.get('imagenes', ''),
         'descripcion': d.get('descripcion', ''), 'caracteristicas': d.get('caracteristicas', ''),
         'link': d.get('link', ''), 'vendidos': '', 'calificacion': ''}
    nuevos.append(r)

json.dump(nuevos + cat_rows, open(RUTA, 'w'), ensure_ascii=False, separators=(',', ':'))
print(json.dumps({'nuevos': [(r['sku'], r['nombre'], r['categoria']) for r in nuevos],
                  'volvieron_a_stock': vuelven, 'faltan_detalle': sin_detalle},
                 ensure_ascii=False, indent=1))
