"""Facebook Marketplace: imprime la URL de la foto y el JavaScript que completa y publica el formulario de "Crear publicación" para el producto pendiente número N de la cola.
Uso: python3 scripts/marketplace_item.py N   (N=0 es el próximo pendiente)
Salida: línea 1 "FOTO <url>", línea 2 "JS <string JSON con el código>" (json.loads para obtener el código y pasarlo a javascript_tool).
El JS devuelve "<sku> OK ..." si publicó, o "<sku> NO <errores>" si no publicó."""
import json,sys,urllib.parse
H=r"""const w=ms=>new Promise(r=>setTimeout(r,ms));const F=l=>{const b=[...document.querySelectorAll('label')].find(x=>x.innerText.trim().split('\n')[0].trim()===l);return b&&b.querySelector('input,textarea')};const put=async(l,v)=>{const e=F(l);if(!e)return l+'?';e.focus();document.execCommand('selectAll');document.execCommand('insertText',false,v);await w(300);return ''};const pick=async(l,v)=>{const e=[...document.querySelectorAll('label')].find(x=>x.innerText.trim().startsWith(l));if(!e)return l+'?';e.click();await w(1200);const o=[...document.querySelectorAll('[role="listbox"] *,[role="dialog"] *')].filter(n=>n.childElementCount===0&&n.innerText&&n.innerText.trim()===v);if(!o.length)return v+'?';o[0].click();await w(800);return ''};const B=t=>[...document.querySelectorAll('[role="button"]')].find(b=>b.innerText.trim()===t&&b.getAttribute('aria-disabled')!=='true');
let e='';e+=await put('Título',D.nombre);e+=await put('Precio',''+D.precio);e+=await pick('Categoría',D.catfb);e+=await pick('Estado',D.estado);const md=B('Más detalles');if(md&&!F('Descripción')){md.click();await w(800)}e+=await put('Descripción',D.desc);if(D.marca)e+=await put('Marca',D.marca);e+=await put('SKU',D.sku);await w(500);
const L=[...document.querySelectorAll('label')].map(l=>l.innerText.replace(/\n/g,'=')).filter(s=>/^(Categor|Estado)/.test(s));const fotos=/Fotos[\s·]*[1-9]\/10/.test(document.body.innerText);
let res='NO';if(!e&&L.length==2&&fotos&&F('Título').value){let b=B('Siguiente');if(b){b.click();await w(3500);b=B('Publicar');if(b){b.click();for(let i=0;i<15;i++){await w(1000);if(/you\/selling/.test(location.href)){res='OK';break}}}}}
D.sku+' '+res+' '+e+' '+L.join(',')+' fotos='+fotos"""
p=json.load(open('scripts/marketplace/publicados.json'))
c=json.load(open('scripts/marketplace/cola.json'))
h=set(p["publicados"])|set(p["ya_estaban"])|set(p.get("revisar",[]))|set(p.get("rechazados_por_facebook",[]))
pend=[x for x in c if x['sku'] not in h]
i=int(sys.argv[1])
x=pend[i]
d={k:x[k] for k in ['sku','nombre','precio','estado','catfb','marca','desc']}
m,_,foot=d['desc'].partition('💸')
if len(m)>550:
    m=m[:550];m=m[:max(m.rfind(chr(10)),m.rfind('. '),300)].rstrip()+'…'+chr(10)*2
d['desc']=m+'💸'+foot
print('FOTO https://tecnoshow.vercel.app/foto.html?u='+urllib.parse.quote(x['imgs'][0],safe=''))
print('JS '+json.dumps('const D='+json.dumps(d,ensure_ascii=False)+';'+H,ensure_ascii=False))
