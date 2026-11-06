"""Facebook Marketplace: arma scripts/marketplace/cola.json con los productos de Mercado Libre (con stock) que faltan publicar.
Uso:
  python3 scripts/marketplace_cola.py                 -> actualiza la cola (mantiene orden, agrega nuevos al final, saca los sin stock)
  python3 scripts/marketplace_cola.py --agotar fb.txt -> fb.txt = títulos publicados y DISPONIBLES en Marketplace (uno por línea);
                                                         imprime los que corresponden a productos SIN stock en ML (para marcar como agotado)
  python3 scripts/marketplace_cola.py --existe fb.txt -> marca como ya_estaban los de la cola cuyo título ya está en fb.txt"""
import json, os, re, sys, unicodedata
D = os.path.dirname(__file__)
R = os.path.join(D, '..', 'public', 'catalogo-ml.json')
COLA = os.path.join(D, 'marketplace', 'cola.json'); PUB = os.path.join(D, 'marketplace', 'publicados.json')
num = lambda v: int(float(re.sub(r'[^\d.]', '', str(v)) or 0))
def norm(s):
    s = unicodedata.normalize('NFKD', s.lower()); s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9 ]', ' ', s.replace('-', ''))
STOP = set('de con para y el la los las en a por marca modelo color negro negra pulgadas watt watts w rms pro profesional led leds usb bluetooth bt si esta publicado es porque disponible'.split())
tok = lambda s: {t for t in norm(s).split() if t not in STOP and len(t) > 1}
mod = lambda T: {t for t in T if re.search(r'\d', t) and re.search(r'[a-z]', t)}
fix = lambda s: re.sub(r'(\d)[.,](\d{3})', r'\1\2', s)
NOK = {'de', 'x', 'con', 'por', 'y', 'a', 'en', 'la', 'el', 'mts', 'pack', 'kit', 'w', 'hz', 'mm', 'cm', 'ip', 'par'}
def keys(s):  # modelos: "pl1530", "apx1200", "hm1125" (sin watts)
    w = norm(fix(s)).split(); K = set()
    for i, t in enumerate(w):
        if re.search(r'\d', t) and re.search(r'[a-z]', t) and len(t) >= 4 and not re.fullmatch(r'\d+w', t): K.add(t)
        if i + 1 < len(w) and re.fullmatch(r'[a-z]{1,4}', t) and t not in NOK and re.fullmatch(r'\d{2,5}[a-z]?', w[i + 1]): K.add(t + w[i + 1])
    return K
def score(a, b):
    T, F = tok(a), tok(b); j = len(T & F) / max(1, len(T | F))
    return j + (0.5 if mod(T) & mod(F) else 0)
ORDEN = ['Parlantes y amplificación', 'Iluminación', 'DJ y consolas', 'Micrófonos', 'Máquinas de humo', 'Auriculares', 'Instrumentos',
         'Video y pantallas', 'Soportes, fundas y estructuras', 'Accesorios', 'Electrónica y repuestos', 'Otros', 'Cables y conectores']
CATFB = {'Iluminación': 'Electrónica e informática', 'Video y pantallas': 'Electrónica e informática', 'Máquinas de humo': 'Electrónica e informática',
         'Electrónica y repuestos': 'Electrónica e informática', 'Otros': 'Varios', 'Accesorios': 'Varios'}
usado = lambda r: re.search(r'\busad[oa]s?\b|\bdemo\b|exhibici', (r['nombre'] + ' ' + r.get('descripcion', '')).lower())
def desc(r):
    d = re.sub(r'[=¯_/\\*]{4,}', ' ', r.get('descripcion', '')).strip()
    d = re.sub(r'\n{3,}', '\n\n', d)
    if len(d) > 900: d = d[:900]; d = d[:d.rfind('\n') if d.rfind('\n') > 400 else d.rfind(' ')].rstrip() + '…'
    return (d + '\n\n' if d else '') + '💸 10% OFF pagando por transferencia.\n📍 Salta 1577, Ciudad de Mendoza.\n🛒 También en Mercado Libre: ' + r['link']
rows = json.load(open(R)); P = json.load(open(PUB))
hechos = set(P['publicados']) | set(P['ya_estaban'])
if len(sys.argv) > 2 and sys.argv[1] == '--agotar':
    fb = [l.strip() for l in open(sys.argv[2]) if l.strip()]
    for f in fb:
        no = max([score(r['nombre'], f) for r in rows if r['stock'] != 'Sí'] or [0])
        si = max([score(r['nombre'], f) for r in rows if r['stock'] == 'Sí'] or [0])
        if no >= 1.0 and si < 1.0: print(f)
    sys.exit()
if len(sys.argv) > 2 and sys.argv[1] == '--existe':
    fb = [l.strip() for l in open(sys.argv[2]) if l.strip()]
    cola = json.load(open(COLA)); n = 0
    for x in cola:
        K = keys(x['nombre'])
        if x['sku'] not in hechos and (max([score(x['nombre'], f) for f in fb] or [0]) >= 1.0 or any(K & keys(f) for f in fb)):
            P['ya_estaban'].append(x['sku']); n += 1
    json.dump(P, open(PUB, 'w'), indent=1); print(n, 'ya estaban'); sys.exit()
ok = {r['sku']: r for r in rows if r.get('stock') == 'Sí' and num(r.get('precio')) > 0 and r.get('imagenes')}
def item(r):
    return dict(sku=r['sku'], cat=r['categoria'], catfb=CATFB.get(r['categoria'], 'Instrumentos musicales'), nombre=r['nombre'].strip()[:99],
                marca=(r.get('marca') or '')[:20], precio=num(r['precio']), estado='Usado - Como nuevo' if usado(r) else 'Nuevo',
                desc=desc(r), imgs=[i.strip() for i in r['imagenes'].split(',') if i.strip()][:5], link=r['link'])
prev = json.load(open(COLA)) if os.path.exists(COLA) else []
cola = [item(ok[x['sku']]) for x in prev if x['sku'] in ok]
ya = {x['sku'] for x in cola}
nuevos = sorted([r for s, r in ok.items() if s not in ya and s not in hechos], key=lambda r: (ORDEN.index(r['categoria']) if r['categoria'] in ORDEN else 99, -num(r['precio'])))
cola += [item(r) for r in nuevos]
json.dump(cola, open(COLA, 'w'), ensure_ascii=False, indent=1)
pend = [x for x in cola if x['sku'] not in hechos]
print(len(cola), 'en la cola,', len(pend), 'pendientes,', len(nuevos), 'nuevos')
