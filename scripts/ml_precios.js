// Comparador de precios. Pegar en javascript_tool con una pestaña en listado.mercadolibre.com.ar.
// Corre en segundo plano y guarda en window.__P = {hechos,total,captcha,res:{sku:[mediana,[precios],[ids]]}}.
// Consultar con: window.__P && {hechos:__P.hechos,total:__P.total,captcha:__P.captcha,fin:__P.fin}
// Al terminar: JSON.stringify(__P.res) (con relleno para que se guarde en archivo).
window.__P={hechos:0,total:0,captcha:false,fin:false,res:{}};
(async()=>{
  const P=window.__P;
  const cat=await fetch('https://raw.githubusercontent.com/vickyvelas/TecnoShow/main/public/catalogo-ml.json').then(r=>r.json());
  const mios=new Set(cat.map(x=>x.sku));
  const stop=new Set('nuevo nueva nuevos envio gratis oferta garantia original exhibido de del la el para con y en x a un una kit pack oficial profesional pro tecshow tecnoshow'.split(' '));
  const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
  const toks=s=>norm(s).split(/[^a-z0-9]+/).filter(t=>t&&!stop.has(t));
  const items=cat.filter(x=>x.stock!=='No'&&+x.precio>0);
  P.total=items.length;
  const parse=h=>{const u=h.replace(/\\\\\\"/g,'"').replace(/\\"/g,'"');
    return u.split('"metadata":{"id":"').slice(1).map(b=>{const g=re=>{const m=b.match(re);return m?m[1]:''};
      return {id:g(/^(MLA\d+)/),t:g(/"type":"title","id":"title","title":\{"text":"([^"]*)"/),
        p:+g(/"current_price":\{"value":([\d.]+)/),s:g(/"id":"seller","seller":\{"text":"([^"]*)"/)}}).filter(x=>x.id&&x.t&&x.p)};
  const una=async x=>{
    const q=toks(x.nombre).slice(0,7);const p=+x.precio;
    const h=await fetch('https://listado.mercadolibre.com.ar/'+q.join('-')+'_NoIndex_True').then(r=>r.text());
    if(/captcha|account-verification/.test(h.slice(0,5000))&&!h.includes('"metadata"')){P.captcha=true;return}
    const clave=q.filter(t=>/\d/.test(t)&&t.length>1);const seen=new Set();
    const ok=parse(h).filter(r=>{if(mios.has(r.id)||/tecno ?show/i.test(r.s)||seen.has(r.id))return false;seen.add(r.id);
      const tt=new Set(toks(r.t));const hit=q.filter(t=>tt.has(t)).length/q.length;
      return hit>=0.6&&clave.every(t=>tt.has(t))&&r.p>p*0.35&&r.p<p*3}).slice(0,5);
    if(ok.length>=2){const s=ok.map(r=>r.p).sort((a,b)=>a-b);const m=s.length%2?s[(s.length-1)/2]:(s[s.length/2-1]+s[s.length/2])/2;
      P.res[x.sku]=[Math.round(m),ok.map(r=>r.p),ok.map(r=>r.id)]}
  };
  let i=0;const worker=async()=>{while(i<items.length&&!P.captcha){const x=items[i++];
    try{await una(x)}catch(e){}P.hechos++;await new Promise(r=>setTimeout(r,400))}};
  await Promise.all([worker(),worker(),worker()]);P.fin=true;
})();
'iniciado'
