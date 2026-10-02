import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { useProductos, GRUPOS, normalizar, linkWhatsApp, formatearPrecio } from "../data/useProductos";
import type { Producto } from "../data/useProductos";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const POR_PAGINA = 48;

function contar(lista: Producto[], k: "categoria" | "subcategoria" | "marca") {
  const m = new Map<string, number>();
  lista.forEach((p) => { if (p[k]) m.set(p[k], (m.get(p[k]) || 0) + 1); });
  return [...m].sort((a, b) => b[1] - a[1]);
}

export default function Productos() {
  const { productos, loading, error, categorias } = useProductos();
  const [sp, setSp] = useSearchParams();
  const [verTodo, setVerTodo] = useState<Record<string, boolean>>({});
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const q = sp.get("q") || "";
  const grupo = sp.get("grupo") || "";
  const cat = sp.get("cat") || "";
  const sub = sp.get("sub") || "";
  const marca = sp.get("marca") || "";
  const min = Number(sp.get("min")) || 0;
  const max = Number(sp.get("max")) || 0;
  const soloStock = sp.get("stock") === "1";
  const orden = sp.get("orden") || "rel";
  const pagina = Math.max(1, Number(sp.get("pag")) || 1);

  const cambiar = (cambios: Record<string, string | null>, mantenerPagina = false) => {
    const n = new URLSearchParams(sp);
    Object.entries(cambios).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k)));
    if (!mantenerPagina) n.delete("pag");
    setSp(n);
    window.scrollTo({ top: 0 });
  };

  const filtrar = (ignorar?: string) => {
    const palabras = normalizar(q).split(/\s+/).filter(Boolean);
    const cats = grupo && GRUPOS[grupo] ? GRUPOS[grupo].categorias : null;
    return productos.filter((p) => {
      if (soloStock && !p.enStock) return false;
      if (cats && !cats.includes(p.categoria)) return false;
      if (ignorar !== "cat" && cat && p.categoria !== cat) return false;
      if (ignorar !== "sub" && sub && p.subcategoria !== sub) return false;
      if (ignorar !== "marca" && marca && p.marca !== marca) return false;
      if (min && (!p.precio || p.precio < min)) return false;
      if (max && (!p.precio || p.precio > max)) return false;
      for (const w of palabras) if (!p.busqueda.includes(w)) return false;
      return true;
    });
  };

  const lista = useMemo(() => {
    const l = filtrar();
    if (orden === "menor") l.sort((a, b) => (a.precio || 1e15) - (b.precio || 1e15));
    else if (orden === "mayor") l.sort((a, b) => (b.precio || 0) - (a.precio || 0));
    else if (orden === "az") l.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    else l.sort((a, b) => Number(b.enStock) - Number(a.enStock) || b.vendidos - a.vendidos || b.calificacion - a.calificacion);
    return l;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productos, sp]);

  const paginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  const pag = Math.min(pagina, paginas);
  const visibles = lista.slice((pag - 1) * POR_PAGINA, pag * POR_PAGINA);
  const titulo = q ? `“${q}”` : sub || cat || (grupo && GRUPOS[grupo]?.nombre) || "Todos los productos";
  const catsVisibles = grupo && GRUPOS[grupo] ? categorias.filter((c) => GRUPOS[grupo].categorias.includes(c)) : categorias;

  const Faceta = ({ titulo, k, param, valor }: { titulo: string; k: "categoria" | "subcategoria" | "marca"; param: string; valor: string }) => {
    const c = contar(filtrar(param), k);
    if (c.length < 2 && !valor) return null;
    const lim = verTodo[param] ? c.length : 8;
    return (
      <div className="mb-6">
        <h3 className="text-[15px] font-semibold text-slate-900 mb-2">{titulo}</h3>
        <ul className="grid gap-1.5">
          {c.slice(0, lim).map(([v, n]) => (
            <li key={v}>
              <button
                onClick={() => { cambiar({ [param]: valor === v ? null : v, ...(param === "cat" ? { sub: null, marca: null } : {}) }); setFiltrosAbiertos(false); }}
                className={`text-left text-sm cursor-pointer hover:text-violet-700 ${valor === v ? "text-violet-700 font-semibold" : "text-slate-700"}`}
              >
                {v} <span className="text-slate-400">({n})</span>
              </button>
            </li>
          ))}
        </ul>
        {c.length > lim && (
          <button onClick={() => setVerTodo({ ...verTodo, [param]: true })} className="mt-2 text-sm text-blue-600 cursor-pointer">
            Mostrar más
          </button>
        )}
      </div>
    );
  };

  const chips: [string, string][] = [];
  if (q) chips.push(["q", `“${q}”`]);
  if (cat) chips.push(["cat", cat]);
  if (sub) chips.push(["sub", sub]);
  if (marca) chips.push(["marca", marca]);
  if (min || max) chips.push(["precio", `${min ? formatearPrecio(min) : "$ 0"} a ${max ? formatearPrecio(max) : "más"}`]);

  return (
    <div className="pt-[104px] md:pt-[112px] bg-white min-h-screen">
      {/* barra de categorías */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto [scrollbar-width:none]">
          <button
            onClick={() => cambiar({ cat: null, sub: null, marca: null, grupo: null })}
            className={`flex-none px-3 py-3 text-sm border-b-2 cursor-pointer ${!cat && !grupo ? "border-violet-600 text-violet-700 font-semibold" : "border-transparent text-slate-500 hover:text-slate-900"}`}
          >
            Todo
          </button>
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => cambiar({ cat: c, sub: null, marca: null, grupo: null })}
              className={`flex-none px-3 py-3 text-sm border-b-2 whitespace-nowrap cursor-pointer ${cat === c ? "border-violet-600 text-violet-700 font-semibold" : "border-transparent text-slate-500 hover:text-slate-900"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-[230px_minmax(0,1fr)] gap-6">
        {/* filtros */}
        <aside
          className={`${filtrosAbiertos ? "fixed inset-0 z-[60] overflow-auto bg-white p-5" : "hidden"} md:static md:block md:p-0`}
          aria-label="Filtros"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[22px] font-semibold leading-tight text-slate-900">{titulo}</h1>
              <p className="text-sm text-slate-500 mb-5">{lista.length.toLocaleString("es-AR")} resultados</p>
            </div>
            <button className="md:hidden p-1 cursor-pointer" onClick={() => setFiltrosAbiertos(false)} aria-label="Cerrar filtros"><X size={22} /></button>
          </div>
          <label className="flex items-center justify-between gap-3 text-sm text-slate-700 mb-6 cursor-pointer">
            Solo productos en stock
            <input type="checkbox" checked={soloStock} onChange={(e) => cambiar({ stock: e.target.checked ? "1" : null })} className="w-4 h-4 accent-violet-600" />
          </label>
          {!cat && catsVisibles.length > 1 && <Faceta titulo="Categorías" k="categoria" param="cat" valor={cat} />}
          <Faceta titulo="Tipo de producto" k="subcategoria" param="sub" valor={sub} />
          <Faceta titulo="Marca" k="marca" param="marca" valor={marca} />
          <div className="mb-6">
            <h3 className="text-[15px] font-semibold text-slate-900 mb-2">Precio</h3>
            <form
              className="flex items-center gap-1.5"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const n = (v: FormDataEntryValue | null) => String(v || "").replace(/\D/g, "") || null;
                cambiar({ min: n(f.get("min")), max: n(f.get("max")) });
                setFiltrosAbiertos(false);
              }}
            >
              <input name="min" defaultValue={min || ""} inputMode="numeric" placeholder="Mínimo" aria-label="Precio mínimo" className="w-full min-w-0 rounded border border-slate-200 px-2 py-1.5 text-sm" />
              <span className="text-slate-400">–</span>
              <input name="max" defaultValue={max || ""} inputMode="numeric" placeholder="Máximo" aria-label="Precio máximo" className="w-full min-w-0 rounded border border-slate-200 px-2 py-1.5 text-sm" />
              <button className="flex-none w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 text-white cursor-pointer" aria-label="Aplicar precio">›</button>
            </form>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <span className="text-xs text-slate-500">
              <Link to="/" className="hover:text-slate-800">Inicio</Link>
              {(cat || grupo) && <> › {cat || GRUPOS[grupo]?.nombre}</>}
              {sub && <> › {sub}</>}
            </span>
            <button onClick={() => setFiltrosAbiertos(true)} className="md:hidden flex items-center gap-1.5 rounded border border-slate-200 px-3 py-1.5 text-sm cursor-pointer">
              <SlidersHorizontal size={14} /> Filtros
            </button>
            <label className="flex items-center gap-1.5 text-sm text-slate-500">
              Ordenar por
              <select value={orden} onChange={(e) => cambiar({ orden: e.target.value === "rel" ? null : e.target.value })} className="bg-transparent font-semibold text-slate-900 cursor-pointer">
                <option value="rel">Más relevantes</option>
                <option value="menor">Menor precio</option>
                <option value="mayor">Mayor precio</option>
                <option value="az">Nombre A–Z</option>
              </select>
            </label>
          </div>

          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {chips.map(([k, l]) => (
                <span key={k} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700">
                  {l}
                  <button className="text-slate-400 hover:text-slate-700 cursor-pointer" aria-label="Quitar filtro" onClick={() => cambiar(k === "precio" ? { min: null, max: null } : { [k]: null })}>×</button>
                </span>
              ))}
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="rounded-lg bg-slate-50 p-10 text-center text-slate-500">No pudimos cargar los productos. Recargá la página o escribinos al 261 418 9999.</div>
          ) : visibles.length === 0 ? (
            <div className="rounded-lg bg-slate-50 p-10 text-center text-slate-500">
              No encontramos productos con esos filtros. Probá quitando alguno o{" "}
              <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">consultanos por WhatsApp</a>.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-2 sm:gap-3">
              {visibles.map((p) => <ProductCard key={p.id} producto={p} />)}
            </div>
          )}

          {paginas > 1 && (
            <nav className="mt-8 flex flex-wrap items-center justify-center gap-1.5" aria-label="Páginas">
              <button disabled={pag === 1} onClick={() => cambiar({ pag: String(pag - 1) }, true)} className="h-9 px-3 rounded text-blue-600 disabled:text-slate-400 cursor-pointer">‹ Anterior</button>
              {Array.from({ length: Math.min(5, paginas) }, (_, i) => Math.max(1, Math.min(pag - 2, paginas - 4)) + i).map((n) => (
                <button key={n} onClick={() => cambiar({ pag: String(n) }, true)} className={`h-9 min-w-9 rounded cursor-pointer ${n === pag ? "bg-violet-50 text-violet-700 font-semibold" : "text-blue-600"}`} aria-current={n === pag}>
                  {n}
                </button>
              ))}
              <span className="text-sm text-slate-500">de {paginas}</span>
              <button disabled={pag === paginas} onClick={() => cambiar({ pag: String(pag + 1) }, true)} className="h-9 px-3 rounded text-blue-600 disabled:text-slate-400 cursor-pointer">Siguiente ›</button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
