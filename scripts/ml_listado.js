// Pegar en javascript_tool con una pestaña abierta en listado.mercadolibre.com.ar (sesión iniciada).
// Devuelve [{sku,nombre,precio,precio_anterior,link}] de todas las publicaciones activas de tecnoshowvelas.
(async()=>{
  const base='https://listado.mercadolibre.com.ar/pagina/tecnoshowvelas/';
  const parse=h=>{const out=[];const parts=h.split('"polycard":{"unique_id"').slice(1);
    for(const b of parts){const g=re=>{const m=b.match(re);return m?m[1]:''};
      const sku=g(/"metadata":\{"id":"(MLA\d+)"/);const t=g(/"type":"title","id":"title","title":\{"text":"((?:[^"\\]|\\.)*)"/);
      if(!sku||!t)continue;
      out.push({sku,nombre:JSON.parse('"'+t+'"'),precio:+g(/"current_price":\{"value":([\d.]+)/)||0,
        precio_anterior:+g(/"previous_price":\{"value":([\d.]+)/)||0,
        link:'https://'+JSON.parse('"'+g(/"url":"((?:[^"\\]|\\.)*)"/)+'"')})}
    return out};
  const first=await fetch(base+'_Desde_1_NoIndex_True').then(r=>r.text());
  if(first.includes('captcha'))return {captcha:true};
  const total=+(first.match(/"total":\s*(\d+)/)||[])[1]||0;
  let all=parse(first);
  for(let d=49;d<=total;d+=48){const h=await fetch(base+`_Desde_${d}_NoIndex_True`).then(r=>r.text());
    if(h.includes('captcha/wall'))return {captcha:true,parcial:all.length};all=all.concat(parse(h))}
  const seen=new Set();all=all.filter(x=>!seen.has(x.sku)&&seen.add(x.sku));
  // el relleno hace que la respuesta se guarde en un archivo en vez de mostrarse entera
  return {total,items:all,_relleno:'.'.repeat(260000)};
})()
