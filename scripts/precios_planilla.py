"""Arma las filas de la hoja "Precios" a partir del resultado de ml_precios.js.
Uso: python3 scripts/precios_planilla.py res.json  -> escribe scripts/precios/filas.json y alertas.json
Referencia: mediana de los (hasta) 5 más baratos de otros vendedores. Estado: "Muy alto" si mi precio > ref*1.15,
"Muy barato" si mi precio < el más barato de los otros *0.85 (debajo de todos), si no "Bien".
"""
import json, sys, datetime, os
UMBRAL = 0.15
cat = {x['sku']: x for x in json.load(open('public/catalogo-ml.json'))}
res = json.load(open(sys.argv[1]))
hoy = datetime.date.today().strftime('%d/%m/%Y')
orden = {'Muy barato': 0, 'Muy alto': 1, 'Bien': 2}
filas = []
def referencia(precios):
    s = sorted(precios)[:5]
    if not s: return None, []
    n = len(s)  # mediana real de los otros vendedores (antes: promedio de los 2 más baratos, que mezclaba extremos)
    return round(s[n // 2] if n % 2 else (s[n // 2 - 1] + s[n // 2]) / 2), s
# excluir.json: {sku: [ids de otros vendedores que NO son el mismo producto]} (revisado por fotos)
excl = json.load(open('scripts/precios/excluir.json')) if os.path.exists('scripts/precios/excluir.json') else {}
minimo = {}
for sku, v in res.items():
    precios, ids = v[1], v[2]
    if sku in excl:
        keep = [i for i, id_ in enumerate(ids) if id_ not in excl[sku]]
        precios = [precios[i] for i in keep]; ids = [ids[i] for i in keep]
    x = cat.get(sku)
    if not x: continue
    p = int(float(x['precio']))
    med, precios = referencia(precios)
    pr = (precios + [''] * 5)[:5]
    if med is None:
        filas.append([x['nombre'], p, '', '', 'Sin iguales en ML', *pr, x['link'], hoy]); continue
    res[sku][0] = med
    dif = p / med - 1
    # "Muy barato" solo si estoy más de 15% debajo del MÁS BARATO de los otros (debajo de todos, no solo de la mediana)
    minimo[sku] = min(precios)
    est = 'Muy alto' if dif > UMBRAL else 'Muy barato' if p < minimo[sku] * (1 - UMBRAL) else 'Bien'
    filas.append([x['nombre'], p, med, round(dif * 100), est, *pr, x['link'], hoy])
filas.sort(key=lambda f: (orden.get(f[4], 3), -abs(f[3] or 0)))
os.makedirs('scripts/precios', exist_ok=True)
import csv
with open('scripts/precios/precios.csv', 'w', newline='') as fh:
    w = csv.writer(fh)
    w.writerow(['Producto', 'Mi precio', 'Referencia ML', 'Diferencia %', 'Estado', 'Precio 1', 'Precio 2', 'Precio 3', 'Precio 4', 'Precio 5', 'Link', 'Actualizado'])
    w.writerows(filas)
baratos = [{'sku': s, 'nombre': cat[s]['nombre'], 'precio': int(float(cat[s]['precio'])), 'mediana': v[0]}
           for s, v in res.items() if s in cat and v[0] and s in minimo and int(float(cat[s]['precio'])) < minimo[s] * (1 - UMBRAL)]
prev = set()
if os.path.exists('scripts/precios/baratos.json'):
    prev = {b['sku'] for b in json.load(open('scripts/precios/baratos.json'))}
json.dump(baratos, open('scripts/precios/baratos.json', 'w'), ensure_ascii=False, indent=0)
nuevos = [b for b in baratos if b['sku'] not in prev]
json.dump(nuevos, open('scripts/precios/alertas.json', 'w'), ensure_ascii=False, indent=0)
print(len(filas), 'filas;', {e: sum(f[4] == e for f in filas) for e in orden}, '; nuevos muy baratos:', len(nuevos))
