"""Genera public/listas/facebook.csv y public/listas/whatsapp.csv (lo que está subido a Facebook Marketplace y a WhatsApp).
La planilla "TecnoShow-mercadolibre" las lee con IMPORTDATA en las hojas "Facebook" y "WhatsApp".
Uso: python3 scripts/listas_csv.py"""
import csv, json, os
D = os.path.dirname(__file__); OUT = os.path.join(D, '..', 'public', 'listas'); os.makedirs(OUT, exist_ok=True)
ml = {r['sku']: r for r in json.load(open(os.path.join(D, '..', 'public', 'catalogo-ml.json')))}
# Facebook
cola = {x['sku']: x for x in json.load(open(os.path.join(D, 'marketplace', 'cola.json')))}
P = json.load(open(os.path.join(D, 'marketplace', 'publicados.json')))
rows = []
for s in P['publicados']:
    x = cola.get(s) or {}; r = ml.get(s, {})
    rows.append([x.get('nombre') or r.get('nombre', ''), x.get('precio', ''), 'Disponible' if r.get('stock', 'Sí') == 'Sí' else 'Sin stock en ML',
                 'Publicado por Claude', s, x.get('link') or r.get('link', '')])
snap = os.path.join(D, 'marketplace', 'facebook_actual.txt')
if os.path.exists(snap):
    for l in open(snap, encoding='utf-8'):
        t, p, e = l.rstrip('\n').split('|')
        rows.append([t, int(p), 'Disponible' if e == 'D' else 'Agotado', 'Ya estaba en Facebook', '', ''])
with open(os.path.join(OUT, 'facebook.csv'), 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f); w.writerow(['Producto', 'Precio', 'Estado', 'Origen', 'SKU Mercado Libre', 'Link Mercado Libre']); w.writerows(rows)
# WhatsApp
wc = json.load(open(os.path.join(D, 'whatsapp', 'cola.json'))); W = json.load(open(os.path.join(D, 'whatsapp', 'cargados.json')))
est = {}
for k, v in [('cargados', 'Cargado por Claude'), ('ya_estaban', 'Ya estaba en WhatsApp'), ('revisar', 'Revisar')]:
    for s in W.get(k, []): est[s] = v
with open(os.path.join(OUT, 'whatsapp.csv'), 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f); w.writerow(['Producto', 'Precio', 'Colección', 'Estado', 'SKU Mercado Libre', 'Link Mercado Libre'])
    for x in wc:
        w.writerow([x['nombre'], x['precio'], x.get('col', ''), est.get(x['sku'], 'Pendiente'), x['sku'], x.get('link', '')])
print(len(rows), 'en facebook.csv,', len(wc), 'en whatsapp.csv')
