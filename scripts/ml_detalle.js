// Pegar en javascript_tool con una pestaña en www.mercadolibre.com.ar. Reemplazar LINKS por la lista
// de {sku,link} de los productos nuevos. Devuelve [{sku,imagenes,descripcion,caracteristicas,marca,link}].
await (async(LINKS)=>{
  const out=[];
  for(const {sku,link} of LINKS){
    try{
      const h=await fetch(link).then(r=>r.text());
      const pics=[...new Set([...h.matchAll(/\{"id":"(\d+-ML[A-Z]\d+_\d+)","alt":"Imagen \d+ de/g)].map(m=>m[1]))].slice(0,6)
        .map(id=>`https://http2.mlstatic.com/D_NQ_NP_2X_${id}-F.webp`);
      const dm=h.match(/"type":"description","state":"VISIBLE","title":"[^"]*","content":"((?:[^"\\]|\\.)*)"/);
      const desc=dm?JSON.parse('"'+dm[1]+'"').replace(/^#\s*/gm,'').replace(/\\n/g,'\n'):'';
      // Saca el texto institucional (envíos, cuotas, horarios) que se repite en todas las publicaciones
      const cut=desc.search(/TECNOSHOW\s*(\||\n|Somos)|FORMAS DE (PAGO|ENV)|Formas de pago\n/);
      const descL=(cut>0?desc.slice(0,cut):desc).replace(/\n{3,}/g,'\n\n').trim();
      const attrs=[...h.matchAll(/\{"id":"([^"]{1,60})","text":"((?:[^"\\]|\\.){1,200})"\}/g)].map(m=>[JSON.parse('"'+m[1]+'"'),JSON.parse('"'+m[2]+'"')]);
      const seen=new Set(),at=attrs.filter(([k])=>!seen.has(k)&&seen.add(k));
      const marca=(at.find(a=>a[0]==='Marca')||[])[1]||'';
      out.push({sku,link,imagenes:pics.join(', '),descripcion:descL,caracteristicas:at.map(a=>a.join(': ')).join(' | '),marca});
    }catch(e){out.push({sku,link,error:String(e)})}
  }
  // el relleno hace que la respuesta se guarde en un archivo en vez de mostrarse entera
  return {out,_relleno:'.'.repeat(260000)};
})(LINKS)
