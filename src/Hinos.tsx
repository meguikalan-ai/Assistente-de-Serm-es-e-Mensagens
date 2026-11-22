import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { lerPdfCC, sqlDasLetras, emLotes } from "./LetrasCC";

const G = "#c9a227", D = "#1a1207";
const bS = (active: any) => ({ padding:"8px 14px", borderRadius:20, border:"1px solid " + (active?G:"#5a3f10"), background:active?G:"transparent", color:active?D:G, fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif", fontWeight:active?"bold":"normal" } as any);
const cS = (active: any) => ({ padding:"6px 12px", borderRadius:14, border:"1px solid " + (active?G:"#5a3f10"), background:active?"rgba(201,162,39,0.2)":"transparent", color:active?G:"#c0a060", fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif", fontWeight:active?"bold":"normal" } as any);

export const HINARIOS = [
  { id:"CC",  nome:"Cantor Cristao" },
  { id:"HCC", nome:"Hinario para o Culto Cristao" },
];

const COLS = "id,hinario_id,numero,titulo,autor,compositor,estrofes,refrao,temas,referencias";

function estrofesDe(h: any): string[] {
  let e = h && h.estrofes;
  if (typeof e === "string") { try { e = JSON.parse(e); } catch (x) { e = [e]; } }
  return Array.isArray(e) ? e : [];
}

// Ignora acentos e maiusculas: "graca" acha "Graça", "ceia" acha "Ceia"
const norm = (s: string) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

let catalogoCache: any[] | null = null;
async function catalogoTitulos(): Promise<any[]> {
  if (catalogoCache) return catalogoCache;
  let todos: any[] = [];
  let ini = 0;
  while (true) {
    const { data, error } = await supabase.from("hinos").select("id,hinario_id,numero,titulo").order("hinario_id").order("numero").range(ini, ini + 999);
    if (error) throw error;
    const lote = data || [];
    todos = todos.concat(lote);
    if (lote.length < 1000) break;
    ini += 1000;
  }
  catalogoCache = todos.map((h: any) => Object.assign({}, h, { _n: norm(h.titulo) }));
  return catalogoCache;
}

async function buscarHinos(hinarioId: string, termo: string) {
  const t = (termo || "").trim();
  const base = () => {
    let q: any = supabase.from("hinos").select(COLS).order("hinario_id").order("numero").limit(50);
    if (hinarioId !== "TODOS") q = q.eq("hinario_id", hinarioId);
    return q;
  };
  if (!t) {
    const { data, error } = await base();
    if (error) throw error;
    return data || [];
  }
  if (/^\d+$/.test(t)) {
    const { data, error } = await base().eq("numero", parseInt(t, 10));
    if (error) throw error;
    return data || [];
  }
  const palavras = norm(t).split(/\s+/).filter(Boolean);
  const [cat, a] = await Promise.all([
    catalogoTitulos().catch(() => [] as any[]),
    base().textSearch("busca", t, { config:"portuguese", type:"websearch" }),
  ]);
  const ids = cat
    .filter((h: any) => (hinarioId === "TODOS" || h.hinario_id === hinarioId) && palavras.every((p: string) => h._n.indexOf(p) >= 0))
    .slice(0, 50)
    .map((h: any) => h.id);
  let porTitulo: any[] = [];
  if (ids.length) {
    const r = await supabase.from("hinos").select(COLS).in("id", ids).order("hinario_id").order("numero");
    if (r.error) throw r.error;
    porTitulo = r.data || [];
  }
  const vistos: any = {};
  const out: any[] = [];
  [...porTitulo, ...(a.data || [])].forEach((h: any) => {
    if (!vistos[h.id]) { vistos[h.id] = 1; out.push(h); }
  });
  if (out.length === 0 && a.error) throw a.error;
  return out.slice(0, 50);
}

async function buscarUmHino(hinarioId: string, numero: number) {
  const { data, error } = await supabase.from("hinos").select(COLS).eq("hinario_id", hinarioId).eq("numero", numero).maybeSingle();
  if (error) throw error;
  return data;
}

async function carregarCatalogo(hinarioId: string) {
  const ids = hinarioId === "TODOS" ? HINARIOS.map(h => h.id) : [hinarioId];
  let linhas: any[] = [];
  for (const id of ids) {
    let ini = 0;
    while (true) {
      const { data, error } = await supabase.from("hinos").select("hinario_id,numero,titulo,estrofes,refrao,temas,referencias").eq("hinario_id", id).order("numero").range(ini, ini + 999);
      if (error) throw error;
      const lote = data || [];
      linhas = linhas.concat(lote);
      if (lote.length < 1000) break;
      ini += 1000;
    }
  }
  return linhas;
}

function HinoLeitura({ h }: any) {
  const est = estrofesDe(h);
  const [copiado, setCopiado] = useState(false);
  const copiar = () => {
    const partes = [h.hinario_id + " " + h.numero + " - " + h.titulo];
    est.forEach((e, i) => { partes.push((i + 1) + ". " + e); if (h.refrao) partes.push("Refrao: " + h.refrao); });
    navigator.clipboard.writeText(partes.join("\n\n")).catch(() => {});
    setCopiado(true); setTimeout(() => setCopiado(false), 2000);
  };
  const meta = [h.autor ? "Letra: " + h.autor : "", h.compositor ? "Musica: " + h.compositor : ""].filter(Boolean).join("  |  ");
  return (
    <div style={{ background:"rgba(26,18,7,0.7)", border:"1px solid #5a3f10", borderRadius:10, padding:16, marginTop:8 }}>
      {meta && <div style={{ fontSize:12, color:"#8a6a30", marginBottom:8 }}>{meta}</div>}
      {((h.temas || []).length > 0 || (h.referencias || []).length > 0) && (
        <div style={{ fontSize:12, color:"#a08040", marginBottom:10 }}>
          {(h.temas || []).length > 0 && <span>Temas: {(h.temas || []).join(", ")}</span>}
          {(h.temas || []).length > 0 && (h.referencias || []).length > 0 && <span>  |  </span>}
          {(h.referencias || []).length > 0 && <span>Textos: {(h.referencias || []).join(", ")}</span>}
        </div>
      )}
      {est.length === 0 && <p style={{ color:"#7a5a30", fontStyle:"italic", margin:0 }}>Este hino ainda nao tem a letra cadastrada.</p>}
      {est.map((e, i) => (
        <div key={i} style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, color:G, letterSpacing:1, marginBottom:4 }}>ESTROFE {i + 1}</div>
          <div style={{ whiteSpace:"pre-line", lineHeight:1.8, fontSize:15, color:"#f0e0b8" }}>{e}</div>
          {h.refrao && (
            <div style={{ whiteSpace:"pre-line", lineHeight:1.8, fontSize:14, color:"#d0b070", fontStyle:"italic", marginTop:8, paddingLeft:12, borderLeft:"3px solid #5a3f10" }}>
              <span style={{ fontSize:11, color:G, letterSpacing:1, fontStyle:"normal" }}>REFRAO</span>{"\n"}{h.refrao}
            </div>
          )}
        </div>
      ))}
      <button onClick={copiar} style={bS(false)}>{copiado ? "Copiado!" : "Copiar letra"}</button>
    </div>
  );
}


// Importador de letras: le o PDF do Cantor Cristao no seu navegador e gera o SQL para colar no Supabase
function ImportadorLetras() {
  const [hinos, setHinos] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");
  const [lendo, setLendo] = useState(false);
  const [copiado, setCopiado] = useState(-1);
  const [texto, setTexto] = useState("");

  const escolher = async (e: any) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setLendo(true); setErro(""); setHinos([]); setCopiado(-1); setTexto("");
    try {
      const r = await lerPdfCC(f, (p: number, t: number) => setMsg("Lendo pagina " + p + " de " + t + "..."));
      setHinos(r); setMsg("");
      if (r.length === 0) setErro("Nao encontrei hinos neste PDF. Ele precisa ser o Cantor Cristao da Cultura Evangelica.");
    } catch (x: any) {
      setErro("Erro ao ler o PDF: " + (x && x.message ? x.message : "tente novamente")); setMsg("");
    }
    setLendo(false);
  };

  const copiar = async (i: number, lote: any[]) => {
    const sql = sqlDasLetras("CC", lote);
    try { await navigator.clipboard.writeText(sql); setTexto(""); }
    catch (x) { setTexto(sql); }
    setCopiado(i);
  };

  const lotes = emLotes(hinos, 100);
  const comRefrao = hinos.filter((h: any) => h.refrao).length;

  return (
    <details style={{ marginTop:28, borderTop:"1px solid #5a3f10", paddingTop:14 }}>
      <summary style={{ cursor:"pointer", color:G, fontSize:13, letterSpacing:1, textTransform:"uppercase" }}>Importar letras do Cantor Cristao (PDF)</summary>
      <p style={{ fontSize:12, color:"#8a6a30", lineHeight:1.7 }}>Escolha o PDF do Cantor Cristao (versao Cultura Evangelica). A leitura acontece no seu navegador. Depois, copie cada parte e execute no SQL Editor do Supabase.</p>
      <input type="file" accept="application/pdf" onChange={escolher} disabled={lendo} style={{ color:"#c0a060", fontSize:13, marginBottom:10 }} />
      {msg && <p style={{ color:G, fontSize:13 }}>{msg}</p>}
      {erro && <p style={{ color:"#e07070", fontSize:13 }}>{erro}</p>}
      {hinos.length > 0 && (
        <div>
          <p style={{ fontSize:13, color:"#c0a060" }}>Li {hinos.length} hinos ({comRefrao} com refrao). Copie cada parte, cole no SQL Editor do Supabase, clique em Run e passe para a proxima.</p>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {lotes.map((lt: any[], i: number) => (
              <button key={i} onClick={() => copiar(i, lt)} style={cS(copiado === i)}>
                {copiado === i ? "Copiado! " : ""}Parte {i + 1} (hinos {lt[0].numero} a {lt[lt.length - 1].numero})
              </button>
            ))}
          </div>
          {copiado >= 0 && !texto && <p style={{ fontSize:12, color:"#8a6a30", fontStyle:"italic" }}>Parte {copiado + 1} copiada. Cole no SQL Editor (Ctrl+V) e clique em Run.</p>}
          {texto && (
            <div>
              <p style={{ fontSize:12, color:"#e0a050" }}>O navegador nao deixou copiar sozinho. Clique na caixa, aperte Ctrl+A e Ctrl+C, e cole no Supabase.</p>
              <textarea readOnly value={texto} onFocus={(e: any) => e.target.select()} style={{ width:"100%", height:120, background:D, color:"#c0a060", border:"1px solid #5a3f10", fontSize:11 }} />
            </div>
          )}
        </div>
      )}
    </details>
  );
}

// Tela de consulta: Estudo > Hinos
export function PainelHinos() {
  const [hin, setHin] = useState("TODOS");
  const [termo, setTermo] = useState("");
  const [res, setRes] = useState<any[]>([]);
  const [buscou, setBuscou] = useState(false);
  const [aberto, setAberto] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const buscar = async (h?: string) => {
    setLoading(true); setErro(""); setAberto(null);
    try {
      const r = await buscarHinos(h || hin, termo);
      setRes(r); setBuscou(true);
    } catch (e: any) { setErro("Erro ao buscar: " + (e && e.message ? e.message : "tente novamente")); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ fontSize:13, color:G, marginBottom:7, letterSpacing:1, textTransform:"uppercase" }}>Hinario</div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
        {[["TODOS","Ambos"], ...HINARIOS.map(h => [h.id, h.nome])].map(([id, l]: any) => (
          <button key={id} onClick={() => { setHin(id); if (buscou) buscar(id); }} style={cS(hin === id)}>{l}</button>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
        <input value={termo} onChange={e => setTermo(e.target.value)} onKeyDown={e => e.key === "Enter" && buscar()} placeholder="Numero, titulo ou palavra da letra..." style={{ flex:1, minWidth:200, padding:"10px 14px", borderRadius:8, border:"1px solid #8a6a20", background:D, color:"#f5e6c8", fontSize:14, fontFamily:"Georgia,serif" }} />
        <button onClick={() => buscar()} disabled={loading} style={{ padding:"10px 22px", borderRadius:8, border:"none", background:loading ? "#6b5010" : "linear-gradient(135deg," + G + ",#a07820)", color:D, fontWeight:"bold", fontSize:14, cursor:loading ? "not-allowed" : "pointer", fontFamily:"Georgia,serif" }}>{loading ? "Buscando..." : "Buscar"}</button>
      </div>
      {erro && <p style={{ color:"#e07070", fontSize:13 }}>{erro}</p>}
      {!buscou && !erro && <p style={{ color:"#7a5a30", fontStyle:"italic", fontSize:13 }}>Digite um numero, parte do titulo ou uma palavra da letra. Deixe vazio e clique em Buscar para listar os primeiros hinos.</p>}
      {buscou && res.length === 0 && !erro && <p style={{ color:"#7a5a30", fontStyle:"italic", fontSize:13 }}>Nenhum hino encontrado. Se a tabela de hinos ainda estiver vazia, importe os hinos primeiro.</p>}
      {res.length >= 50 && <p style={{ color:"#8a6a30", fontSize:12, fontStyle:"italic" }}>Mostrando os 50 primeiros resultados. Refine a busca para ver outros.</p>}
      {res.map((h: any) => (
        <div key={h.id} style={{ marginBottom:8 }}>
          <button onClick={() => setAberto(aberto === h.id ? null : h.id)} style={{ width:"100%", textAlign:"left", padding:"10px 14px", borderRadius:8, border:"1px solid " + (aberto === h.id ? G : "#5a3f10"), background:aberto === h.id ? "rgba(201,162,39,0.12)" : "transparent", color:"#f0e0b8", fontSize:14, cursor:"pointer", fontFamily:"Georgia,serif" }}>
            <span style={{ color:G, fontWeight:"bold" }}>{h.hinario_id} {h.numero}</span>  -  {h.titulo}
          </button>
          {aberto === h.id && <HinoLeitura h={h} />}
        </div>
      ))}
      <ImportadorLetras />
    </div>
  );
}

const SUGERIR_SYS = "Voce e um ministro de louvor batista experiente. Recebera o resumo de um sermao e um CATALOGO de hinos reais (formato de cada linha: hinario|numero|titulo|temas|textos biblicos|primeiro verso). Escolha de 5 a 8 hinos DO CATALOGO para o culto em que o sermao sera pregado. REGRA ABSOLUTA: use somente hinos que estejam no catalogo, com hinario e numero exatamente como constam nele; nunca invente nem cite hino fora do catalogo e nao reproduza letras. Distribua pelos momentos do culto (Abertura, Adoracao, Antes da Palavra, Resposta ao sermao, Apelo, Encerramento), usando so os que fizerem sentido. Prefira hinos cuja doutrina e texto dialoguem com a passagem e o tema do sermao, evitando hinos apenas emocionais ou sem relacao com a mensagem. Em motivo, explique em uma ou duas frases a ligacao teologica com o sermao. Responda SOMENTE com JSON valido neste formato: {\"hinos\":[{\"hinario\":\"CC\",\"numero\":1,\"momento\":\"Abertura\",\"motivo\":\"...\"}]}";

// Aba "Hinos" dentro do sermao gerado
export function PainelHinosSermao({ sermon, hinarioId, onUpdate, callAPI }: any) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [abertos, setAbertos] = useState<any>({});
  const hinos: any[] = (sermon && sermon.hinos) || [];
  const hid = hinarioId || "CC";
  const nomeHin = hid === "TODOS" ? "Cantor Cristao e Hinario para o Culto Cristao" : (HINARIOS.find(h => h.id === hid) || { nome: hid }).nome;

  const sugerir = async () => {
    setLoading(true); setErro("");
    try {
      const cat = await carregarCatalogo(hid);
      if (cat.length === 0) { setErro("Nao ha hinos cadastrados neste hinario. Importe os hinos na tabela de hinos primeiro."); setLoading(false); return; }
      const linhas = cat.map((h: any) => {
        const primeiro = (estrofesDe(h)[0] || "").split("\n")[0].slice(0, 45);
        return [h.hinario_id, h.numero, h.titulo, (h.temas || []).slice(0, 3).join(", "), (h.referencias || []).slice(0, 3).join(", "), primeiro].join("|");
      });
      const resumo = [
        "Titulo: " + (sermon.titulo || ""),
        "Passagem: " + (sermon.pericope || ""),
        "Tema: " + (sermon.tema || ""),
        "Pontos: " + (sermon.pontos || []).map((p: any) => p.titulo).join("; "),
        "Apelo: " + String(sermon.apelo || "").slice(0, 300),
      ].join("\n");
      const r = await callAPI(SUGERIR_SYS, "SERMAO:\n" + resumo + "\n\nCATALOGO:\n" + linhas.join("\n"), 2500);
      const mapa: any = {};
      cat.forEach((h: any) => { mapa[h.hinario_id + "-" + h.numero] = h; });
      const vistos: any = {};
      const out: any[] = [];
      (r.hinos || []).forEach((p: any) => {
        const hh = String(p.hinario || (hid !== "TODOS" ? hid : "")).toUpperCase();
        const num = parseInt(p.numero, 10);
        const achado = mapa[hh + "-" + num];
        if (achado && !vistos[hh + "-" + num]) {
          vistos[hh + "-" + num] = 1;
          out.push({ hinario_id: hh, numero: num, titulo: achado.titulo, momento: p.momento || "", motivo: p.motivo || "" });
        }
      });
      if (out.length === 0) { setErro("A IA nao indicou hinos validos do catalogo. Tente novamente."); setLoading(false); return; }
      onUpdate(Object.assign({}, sermon, { hinos: out.slice(0, 8) }));
      setAbertos({});
    } catch (e: any) { setErro("Erro: " + (e && e.message ? e.message : "tente novamente")); }
    setLoading(false);
  };

  const remover = (i: number) => onUpdate(Object.assign({}, sermon, { hinos: hinos.filter((_: any, k: number) => k !== i) }));

  const alternar = async (h: any) => {
    const k = h.hinario_id + "-" + h.numero;
    if (abertos[k]) { setAbertos(Object.assign({}, abertos, { [k]: null })); return; }
    try {
      const row = await buscarUmHino(h.hinario_id, h.numero);
      setAbertos(Object.assign({}, abertos, { [k]: row || { hinario_id: h.hinario_id, numero: h.numero, titulo: h.titulo, estrofes: [] } }));
    } catch (e: any) { setErro("Erro ao abrir o hino."); }
  };

  return (
    <div>
      <h3 style={{ color:G, fontSize:14, marginTop:0 }}>HINOS PARA ESTE CULTO</h3>
      <p style={{ fontSize:12, color:"#8a6a30", fontStyle:"italic", marginTop:0 }}>Hinario: {nomeHin}. Os hinos vem do seu banco de hinos; a IA apenas escolhe os numeros.</p>
      <button onClick={sugerir} disabled={loading} style={bS(false)}>{loading ? "Escolhendo hinos..." : (hinos.length ? "Sugerir novamente" : "Sugerir hinos")}</button>
      {hinos.length > 0 && <span style={{ fontSize:12, color:"#8a6a30", marginLeft:10 }}>Clique em Salvar (acima) para guardar estas sugestoes no sermao.</span>}
      {erro && <p style={{ color:"#e07070", fontSize:13 }}>{erro}</p>}
      <div style={{ marginTop:14 }}>
        {hinos.map((h: any, i: number) => {
          const k = h.hinario_id + "-" + h.numero;
          return (
            <div key={k} style={{ background:"rgba(60,40,10,0.5)", border:"1px solid #7a5a15", borderRadius:10, padding:14, marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, flexWrap:"wrap" }}>
                <div style={{ fontSize:15, color:"#f0e0b8" }}><span style={{ color:G, fontWeight:"bold" }}>{h.hinario_id} {h.numero}</span>  -  {h.titulo}</div>
                {h.momento && <span style={{ fontSize:11, color:G, letterSpacing:1, textTransform:"uppercase", border:"1px solid #5a3f10", borderRadius:10, padding:"2px 8px" }}>{h.momento}</span>}
              </div>
              {h.motivo && <p style={{ margin:"8px 0", lineHeight:1.7, fontSize:14, color:"#c0a060" }}>{h.motivo}</p>}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                <button onClick={() => alternar(h)} style={cS(!!abertos[k])}>{abertos[k] ? "Ocultar letra" : "Ver letra"}</button>
                <button onClick={() => remover(i)} style={cS(false)}>Remover</button>
              </div>
              {abertos[k] && <HinoLeitura h={abertos[k]} />}
            </div>
          );
        })}
        {hinos.length === 0 && !loading && <p style={{ color:"#7a5a30", fontStyle:"italic", fontSize:13 }}>Nenhum hino sugerido ainda para este sermao.</p>}
      </div>
    </div>
  );
}
