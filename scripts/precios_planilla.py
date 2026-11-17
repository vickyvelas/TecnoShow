"""Arma las filas de la hoja "Precios" a partir del resultado de ml_precios.js.
Uso: python3 scripts/precios_planilla.py res.json  -> escribe scripts/precios/filas.json y alertas.json
Referencia: promedio de los 5 más baratos de otros vendedores; si el más caro de esos 5 supera 1.5x al más barato,
se usan solo los 2 más baratos. Estado: "Muy alto" si mi precio > ref*1.15, "Muy barato" si < ref*0.85, si no "Bien".
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
    if s[-1] > s[0] * 1.5: s = s[:2]
    return round(sum(s) / len(s)), s
for sku, (_, precios, ids) in res.items():
    x = cat.get(sku)
    if not x: continue
    p = int(float(x['precio']))
    med, precios = referencia(precios)
    res[sku][0] = med
    dif = p / med - 1
    est = 'Muy alto' if dif > UMBRAL else 'Muy barato' if dif < -UMBRAL else 'Bien'
    pr = (precios + [''] * 5)[:5]
    filas.append([x['nombre'], p, med, round(dif * 100), est, *pr, x['link'], hoy])
filas.sort(key=lambda f: (orden[f[4]], -abs(f[3])))
os.makedirs('scripts/precios', exist_ok=True)
import csv
with open('scripts/precios/precios.csv', 'w', newline='') as fh:
    w = csv.writer(fh)
    w.writerow(['Producto', 'Mi precio', 'Referencia ML', 'Diferencia %', 'Estado', 'Precio 1', 'Precio 2', 'Precio 3', 'Precio 4', 'Precio 5', 'Link', 'Actualizado'])
    w.writerows(filas)
baratos = [{'sku': s, 'nombre': cat[s]['nombre'], 'precio': int(float(cat[s]['precio'])), 'mediana': v[0]}
           for s, v in res.items() if s in cat and int(float(cat[s]['precio'])) < v[0] * (1 - UMBRAL)]
prev = set()
if os.path.exists('scripts/precios/baratos.json'):
    prev = {b['sku'] for b in json.load(open('scripts/precios/baratos.json'))}
json.dump(baratos, open('scripts/precios/baratos.json', 'w'), ensure_ascii=False, indent=0)
nuevos = [b for b in baratos if b['sku'] not in prev]
json.dump(nuevos, open('scripts/precios/alertas.json', 'w'), ensure_ascii=False, indent=0)
print(len(filas), 'filas;', {e: sum(f[4] == e for f in filas) for e in orden}, '; nuevos muy baratos:', len(nuevos))
