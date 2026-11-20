// Comparador de precios. Pegar en javascript_tool con una pestaña en listado.mercadolibre.com.ar.
// Corre en segundo plano y guarda en window.__P = {hechos,total,captcha,fin,res:{sku:[0,[precios asc],[ids],[titulos],[fotos]]}}.
// Mismo producto: si mi publicación es de catálogo (/p/MLA..) solo acepta el mismo product_id;
// si no, exige marca + todos los números/modelo del título y 75% de palabras. Misma condición (nuevo/usado)
// y no mezcla unidades con packs/pares/kits. Guarda los 5 más baratos de otros vendedores.
// Consultar: ({h:__P.hechos,t:__P.total,c:__P.captcha,f:__P.fin,n:Object.keys(__P.res).length})
// Bajar: ({res:__P.res,_relleno:'.'.repeat(200000)})  -> se guarda en archivo; luego precios_planilla.py
window.__P={hechos:0,total:0,captcha:false,fin:false,res:{}};
(async()=>{
  const P=window.__P;
  const cat=await fetch('https://raw.githubusercontent.com/vickyvelas/TecnoShow/main/public/catalogo-ml.json').then(r=>r.json());
  const mios=new Set(cat.map(x=>x.sku));
  const stop=new Set('nuevo nueva nuevos envio gratis oferta garantia original exhibido de del la el para con y en x a un una oficial profesional pro tecshow tecnoshow color negro negra'.split(' '));
  const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
  const toks=s=>norm(s).split(/[^a-z0-9]+/).filter(t=>t&&!stop.has(t));
  // cantidad de unidades del título (pack 5, x2, 2un, par = 2); tiene que coincidir
  const cant=s=>{s=norm(s);let m=s.match(/\b(?:x|pack|pak|kit|combo|set|juego)\s?(\d{1,2})(?=\s?(?:u|un|uni|unid|unidades)?\b)/)||s.match(/\b(\d{1,2})\s?(?:u|un|uni|unid|unidades)\b/);
    if(m)return +m[1];return /\b(par|pares)\b/.test(s)?2:1};
  // palabras de tipo: si la otra publicación las tiene y la mía no, es otro producto (adaptador, repuesto, etc.)
  const tipo=new Set('plug adaptador repuesto reparo reparacion tapa funda soporte base control estuche bolso cubierta membrana diafragma bobina kit'.split(' '));
  const items=cat.filter(x=>x.stock!=='No'&&+x.precio>0);
  P.total=items.length;
  const parse=h=>{const u=h.replace(/\\\\\\"/g,'"').replace(/\\"/g,'"');
    return u.split('"metadata":{"id":"').slice(1).map(b=>{const g=re=>{const m=b.match(re);return m?m[1]:''};
      return {id:g(/^(MLA\d+)/),pid:g(/"product_id":"(MLA\d+)"/),t:g(/"type":"title","id":"title","title":\{"text":"([^"]*)"/),
        f:g(/"pictures":\[\{"id":"([^"]+)"/),p:+g(/"current_price":\{"value":([\d.]+)/),s:g(/"id":"seller","seller":\{"text":"([^"]*)"/),
        usado:/"item_condition":\{"text":"(Usado|Reacondicionado)"/.test(b.slice(0,6000))}}).filter(x=>x.id&&x.t&&x.p)};
  const una=async x=>{
    const tod=[...new Set(toks(x.nombre))];const q=tod.slice(0,7);const p=+x.precio;
    const miPid=(x.link.match(/\/p\/(MLA\d+)/)||[])[1]||'';const miUsado=/usado/i.test(x.nombre);const miCant=cant(x.nombre);
    const marca=toks(x.marca||'')[0];
    // modelo/números de TODO el título (no solo las primeras 7 palabras): f11, 2200mah, 1500...
    const clave=tod.filter(t=>/\d/.test(t)&&t.length>1);const miTok=new Set(tod);if(marca&&q.includes(marca))clave.push(marca);
    const buscar=async(qq,minHit)=>{
      const h=await fetch('https://listado.mercadolibre.com.ar/'+qq.join('-')+'_NoIndex_True').then(r=>r.text());
      if(/captcha|account-verification/.test(h.slice(0,5000))&&!h.includes('"metadata"')){P.captcha=true;return []}
      const seen=new Set();
      return parse(h).filter(r=>{if(mios.has(r.id)||/tecno ?show/i.test(r.s)||r.p===p||seen.has(r.id))return false;seen.add(r.id);
        if(r.usado!==miUsado||cant(r.t)!==miCant)return false;
        if(r.p<p*0.35||r.p>p*3)return false;
        if(miPid&&r.pid)return r.pid===miPid;
        const tt=new Set(toks(r.t));if([...tt].some(t=>tipo.has(t)&&!miTok.has(t)))return false;
        const hit=q.filter(t=>tt.has(t)).length/q.length;
        return hit>=minHit&&clave.every(t=>tt.has(t))})};
    let ok=await buscar(q,0.75);
    // segunda búsqueda más corta (marca + modelo) si la primera trajo pocos
    if(ok.length<2&&!P.captcha){const corta=[...new Set([marca,...q.slice(0,2),...clave].filter(Boolean))].slice(0,5);
      if(corta.join()!==q.join()){const ids=new Set(ok.map(r=>r.id));ok=ok.concat((await buscar(corta,0.6)).filter(r=>!ids.has(r.id)))}}
    ok=ok.sort((a,b)=>a.p-b.p).slice(0,5);
    P.res[x.sku]=[0,ok.map(r=>r.p),ok.map(r=>r.id),ok.map(r=>r.t),ok.map(r=>r.f)];
  };
  let i=0;const worker=async()=>{while(i<items.length&&!P.captcha){const x=items[i++];
    try{await una(x)}catch(e){}P.hechos++;await new Promise(r=>setTimeout(r,400))}};
  await Promise.all([worker(),worker(),worker()]);P.fin=true;
})();
'iniciado'
