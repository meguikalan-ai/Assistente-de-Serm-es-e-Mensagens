// Leitura do PDF do Cantor Cristao (versao Cultura Evangelica) e geracao do SQL das letras.
// Tudo roda no navegador, com o PDF que voce escolher. Nada e enviado a lugar nenhum:
// o SQL so vai para o Supabase quando voce mesmo colar e executar la.

export type HinoLido = { numero: number; titulo: string; estrofes: string[]; refrao: string };

const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";

async function carregarPdfJs(): Promise<any> {
  const w: any = window;
  if (!w.pdfjsLib) {
    await new Promise<void>((ok, erro) => {
      const s = document.createElement("script");
      s.src = PDFJS + "pdf.min.js";
      s.onload = () => ok();
      s.onerror = () => erro(new Error("Nao foi possivel carregar o leitor de PDF. Verifique a conexao."));
      document.head.appendChild(s);
    });
    w.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + "pdf.worker.min.js";
  }
  return w.pdfjsLib;
}

// Junta os pedacos de texto de uma pagina em linhas (pela posicao vertical)
export function linhasDaPagina(items: any[]): string[] {
  const linhas: string[] = [];
  let atual = "";
  let y: number | null = null;
  for (const it of items) {
    if (typeof it.str !== "string") continue;
    const yi = Math.round(it.transform[5]);
    if (y !== null && Math.abs(yi - y) > 2) { linhas.push(atual); atual = ""; }
    atual += it.str;
    y = yi;
  }
  if (atual) linhas.push(atual);
  return linhas;
}

// Transforma as linhas do livro inteiro em hinos (numero, titulo, estrofes, refrao)
export function interpretarCC(linhasBrutas: string[]): HinoLido[] {
  const linhas = linhasBrutas
    .map(l => l.replace(/\s+/g, " ").trim())
    .filter(l => l && !/Cultura Evang|blogspot/i.test(l));

  const blocos: { numero: number; titulo: string; linhas: string[] }[] = [];
  let proximo = 1;
  for (const l of linhas) {
    const m = l.match(/^(\d{1,3})\s*[-\u2013]\s*(.+)$/);
    if (m && parseInt(m[1], 10) === proximo) {
      blocos.push({ numero: proximo, titulo: m[2].trim(), linhas: [] });
      proximo++;
      continue;
    }
    if (blocos.length) blocos[blocos.length - 1].linhas.push(l);
  }

  return blocos.map(b => {
    const estrofes: string[] = [];
    const coros: string[] = [];
    let tipo = "solto";
    let buf: string[] = [];
    const fechar = () => {
      const t = buf.join("\n").trim();
      if (t) {
        if (tipo === "coro") { if (coros.indexOf(t) < 0) coros.push(t); }
        else estrofes.push(t);
      }
      buf = [];
    };
    for (const l of b.linhas) {
      if (/^\[\s*\d+\s*\]$/.test(l)) { fechar(); tipo = "estrofe"; continue; }
      if (/^\[\s*(c[o\u00f4]ro|corus)\s*\]$/i.test(l)) { fechar(); tipo = "coro"; continue; }
      buf.push(l);
    }
    fechar();
    return { numero: b.numero, titulo: b.titulo, estrofes, refrao: coros.join("\n\n") };
  });
}

export async function lerPdfCC(arquivo: File, aoProgredir?: (p: number, total: number) => void): Promise<HinoLido[]> {
  const pdfjs = await carregarPdfJs();
  const dados = new Uint8Array(await arquivo.arrayBuffer());
  const doc = await pdfjs.getDocument({ data: dados }).promise;
  let linhas: string[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const pg = await doc.getPage(p);
    const tc = await pg.getTextContent();
    linhas = linhas.concat(linhasDaPagina(tc.items));
    if (aoProgredir) aoProgredir(p, doc.numPages);
  }
  return interpretarCC(linhas);
}

const q = (s: string) => "'" + s.replace(/'/g, "''") + "'";

// SQL que grava as letras na tabela hinos (um lote de hinos)
export function sqlDasLetras(hinarioId: string, hinos: HinoLido[]): string {
  const vals = hinos
    .map(h => "(" + h.numero + "," + q(JSON.stringify(h.estrofes)) + "," + q(h.refrao) + ")")
    .join(",\n");
  return (
    "update hinos as h set estrofes = v.e::jsonb, refrao = nullif(v.r, '')\n" +
    "from (values\n" + vals + "\n) as v(numero, e, r)\n" +
    "where h.hinario_id = " + q(hinarioId) + " and h.numero = v.numero;"
  );
}

export function emLotes(hinos: HinoLido[], tamanho = 100): HinoLido[][] {
  const lotes: HinoLido[][] = [];
  for (let i = 0; i < hinos.length; i += tamanho) lotes.push(hinos.slice(i, i + tamanho));
  return lotes;
}
