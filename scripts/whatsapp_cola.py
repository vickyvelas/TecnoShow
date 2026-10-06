"""Arma scripts/whatsapp/cola.json: productos para cargar en el catálogo de WhatsApp Business, en orden.
Solo "cosas copadas": con stock, sin cables/fichas/soportes/electrónica/otros, sin usados/demo.
Mantiene el orden de los que ya estaban en la cola y agrega al final los productos nuevos.
Uso: python3 scripts/whatsapp_cola.py"""
import json, os, re
D = os.path.dirname(__file__)
R = os.path.join(D, '..', 'public', 'catalogo-ml.json')
COLA = os.path.join(D, 'whatsapp', 'cola.json')
num = lambda v: int(float(re.sub(r'[^\d.]', '', str(v)) or 0))
ORDEN = ['Parlantes y amplificación', 'Iluminación', 'Auriculares', 'DJ y consolas', 'Máquinas de humo', 'Líquidos',
         'Micrófonos', 'Instrumentos', 'Video y pantallas']
COL = {'Parlantes y amplificación': 'Audio: parlantes y potencias', 'DJ y consolas': 'DJ'}
def grupo(r):
    if r['categoria'] == 'Máquinas de humo' and r.get('subcategoria') == 'Líquidos': return 'Líquidos'
    return r['categoria']
usado = lambda r: re.search(r'\busad[oa]s?\b|\bdemo\b|exhibici', (r['nombre'] + ' ' + r.get('descripcion', '')).lower())
def desc(r):
    at = [a.strip() for a in r.get('caracteristicas', '').split('|') if a.strip()
          and not re.search(r'certificaci|OCP|IRAM|Color principal|alimentaci|Autonom|:\s*0( h)?$|Incluye pilas|compatibles', a)][:6]
    d = re.sub(r'\s+', ' ', r.get('descripcion', '')).strip()
    d = re.sub(r'[=¯_/\\*]{4,}', ' ', d).strip()
    if len(d) > 220:
        d = d[:220]; d = d[:max(d.rfind('. ') + 1, d.rfind(' '))].rstrip(' ,') + '…'
    s = (d + ' ' if d else '') + ('Características: ' + ' · '.join(at) + '. ' if at else '')
    return s + '💸 10% OFF pagando por transferencia. 📍 Salta 1577, Ciudad de Mendoza.'
rows = json.load(open(R))
ok = [r for r in rows if r.get('stock') == 'Sí' and num(r.get('precio')) > 0 and r.get('imagenes')
      and grupo(r) in ORDEN and not usado(r)]
ok.sort(key=lambda r: (ORDEN.index(grupo(r)), -num(r['precio'])))
prev = json.load(open(COLA)) if os.path.exists(COLA) else []
ya = {x['sku'] for x in prev}
by = {r['sku']: r for r in rows}
cola = []
for x in prev:  # refresca datos de los que siguen en la cola
    r = by.get(x['sku'])
    if r: x.update(nombre=r['nombre'].strip(), precio=num(r['precio']))
    cola.append(x)
for r in ok:
    if r['sku'] in ya: continue
    g = grupo(r)
    cola.append(dict(sku=r['sku'], col=COL.get(g, g), nombre=r['nombre'].strip()[:150], precio=num(r['precio']), desc=desc(r),
                     link='https://tecnoshow.vercel.app/#' + r['sku'],
                     img=r['imagenes'].split(',')[0].strip().replace('-F.webp', '-F.jpg')))
json.dump(cola, open(COLA, 'w'), ensure_ascii=False, indent=0)
print(len(cola), 'productos en la cola')
