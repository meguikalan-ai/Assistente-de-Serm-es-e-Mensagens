import React, { useState, useEffect } from "react";

const G = "#c9a227", D = "#1a1207";

const VERSOES = [
  { id:"ARC",  label:"ARC",  desc:"Almeida Revista e Corrigida" },
  { id:"ACF",  label:"ACF",  desc:"Almeida Corrigida Fiel" },
  { id:"NAA",  label:"NAA",  desc:"Nova Almeida Atualizada" },
  { id:"NVI",  label:"NVI",  desc:"Nova Versao Internacional" },
  { id:"KJA",  label:"KJA",  desc:"King James Atualizada em Portugues" },
  { id:"SBTB", label:"SBTB", desc:"Soc. Biblica Trinitariana do Brasil" },
  { id:"VLH",  label:"VLH",  desc:"Versao na Linguagem de Hoje (SBB)" },
];

const ESTILOS = [
  { id:"original", label:"Original",   desc:"Estilo natural da IA" },
  { id:"isaltino", label:"Pastoral",   desc:"Estilo do Pr. Isaltino Gomes Coelho Filho" },
  { id:"billy",    label:"Evangelista",desc:"Estilo evangelistico de Billy Graham" },
];

const DURACOES = [
  { id:"20min", label:"20 min",      icon:"lightning", desc:"Estrutura objetiva, impacto direto.",      instrucao:"DURACAO 20 MIN: Estrutura objetiva. Introducao curta. Contexto resumido. Desenvolvimento direto. Aplicacoes rapidas. Foco na ideia central." },
  { id:"30min", label:"30 min",      icon:"clock",     desc:"Equilibrio profundidade e objetividade.",  instrucao:"DURACAO 30 MIN: Equilibrio profundidade e objetividade. Contexto moderado. Desenvolvimento pastoral consistente. Uma ou duas ilustracoes." },
  { id:"40min", label:"40 min",      icon:"book",      desc:"Exposicao aprofundada, exegese expandida.",instrucao:"DURACAO 40 MIN: Exposicao aprofundada. Maior desenvolvimento exegetico. Aplicacoes pastorais amplas. Mais conexoes biblicas. Ilustracoes elaboradas." },
  { id:"60min", label:"Estudo (1h)", icon:"grad",      desc:"Analise exegetica expandida. EBD e discipulado.",instrucao:"DURACAO ESTUDO 1 HORA: Exposicao detalhada. Analise exegetica expandida. Contexto historico amplo. Explicacoes doutrinarias. Referencias cruzadas. Aplicacoes discipuladoras. Mantenha oralidade e tom pastoral." },
];

const PERFIS_IGREJA = [
  { id:"tradicional",   label:"Batista Tradicional",   icon:"church", desc:"Culto reverente, hinario, exposicao biblica, linguagem classica.",       instrucao:"PERFIL BATISTA TRADICIONAL: Tom sobrio e reverente. Profundidade biblica. Linguagem pastoral classica. Aplicacoes familiares e eclesiasticas. Enfase evangelistica. Prefira ACF e ARC." },
  { id:"contemporanea", label:"Batista Contemporanea",  icon:"city",   desc:"Linguagem acessivel, culto contemporaneo, foco missional e urbano.",     instrucao:"PERFIL BATISTA CONTEMPORANEA: Comunicacao fluida e acessivel. Aplicacoes atuais conectando Biblia e cotidiano. Evite terminologia tecnica. Introducoes conectadas a vida moderna." },
  { id:"reformada",     label:"Batista Reformada",      icon:"scroll", desc:"Exegese forte, pregacao expositiva, profundidade doutrinaria.",          instrucao:"PERFIL BATISTA REFORMADA: Aprofunde contexto biblico e exposicao textual. Evite superficialidade emocional. Enfatize soberania de Deus, graca e cristocentrismo. Aplicacoes derivadas do texto." },
  { id:"renovada",      label:"Batista Renovada",       icon:"fire",   desc:"Culto espontaneo, enfase em oracao e avivamento.",                       instrucao:"PERFIL BATISTA RENOVADA: Tom mais caloroso. Enfatize renovacao espiritual. Mantenha equilibrio biblico rigoroso. Evite exageros neopentecostais. Apelo intenso mas ancorado no texto." },
  { id:"jovem",         label:"Batista Jovem/Urbana",   icon:"bolt",   desc:"Publico jovem, linguagem moderna, cultura urbana, discipulado missional.",instrucao:"PERFIL BATISTA JOVEM URBANA: Aplicacoes contemporaneas sobre ansiedade, proposito, identidade. Comunicacao dinamica. Evite formalismo. Fidelidade biblica com linguagem relevante para jovens." },
  { id:"plantacao",     label:"Igreja em Plantacao",    icon:"sprout", desc:"Igreja nova, foco evangelistico, membros em formacao doutrinaria.",      instrucao:"PERFIL PLANTACAO: Sermons encorajadores enfatizando missao, perseveranca e unidade. Aplicacoes simples. Evite tecnicismo. Fortaleça identidade e visao ministerial." },
  { id:"revitalizacao", label:"Igreja em Revitalizacao",icon:"dove",   desc:"Igreja em renovacao, necessidade de restauracao e reconstrucao.",        instrucao:"PERFIL REVITALIZACAO: Sermons restauradores equilibrando confronto e graca. Tom esperancoso. Trabalhe renovacao e reconciliacao. Fortaleça identidade biblica da igreja." },
];

const PERFIS_PUBLICO = [
  { id:"familias",      label:"Familias" },
  { id:"jovens",        label:"Jovens" },
  { id:"novos",         label:"Novos Convertidos" },
  { id:"lideranca",     label:"Lideranca" },
  { id:"madura",        label:"Igreja Madura" },
  { id:"evangelistico", label:"Culto Evangelistico" },
  { id:"missoes",       label:"Conf. Missionaria" },
  { id:"retiro",        label:"Retiro Espiritual" },
  { id:"ebd",           label:"EBD" },
  { id:"doutrina",      label:"Culto de Doutrina" },
];

const SERMON_TYPES = [
  { id:"expositivo",    label:"Expositivo",    desc:"Explica um texto versículo por versículo" },
  { id:"tematico",      label:"Tematico",      desc:"Aborda um tema com varios textos" },
  { id:"textual",       label:"Textual",       desc:"Baseia-se em um unico versículo" },
  { id:"narrativo",     label:"Narrativo",     desc:"Conta uma historia biblica" },
  { id:"biografico",    label:"Biografico",    desc:"Examina a vida de um personagem" },
  { id:"doutrinario",   label:"Doutrinario",   desc:"Expoe uma doutrina crista" },
  { id:"devocional",    label:"Devocional",    desc:"Focado na edificacao espiritual" },
  { id:"evangelistico", label:"Evangelistico", desc:"Direcionado a nao-crentes" },
  { id:"exortativo",    label:"Exortativo",    desc:"Corrige, adverte ou encoraja" },
  { id:"profetico",     label:"Profetico",     desc:"Baseado em passagens profeticas" },
];

const TIPO_PROMPTS = {
  expositivo:"Sermao expositivo em 3 divisoes progressivas explicando o texto versiculo por versiculo.",
  tematico:"Sermao tematico em 3 pontos usando o texto principal e textos de apoio.",
  textual:"Sermao textual analisando as principais expressoes do versiculo em 3 pontos.",
  narrativo:"Sermao narrativo em 3 momentos narrativos com licoes teologicas.",
  biografico:"Sermao biografico explorando trajetoria e licoes do personagem em 3 pontos.",
  doutrinario:"Sermao doutrinario com base biblica solida em 3 pontos.",
  devocional:"Sermao devocional pastoral e reflexivo em 3 pontos de edificacao.",
  evangelistico:"Sermao evangelistico com conviccao e ternura em 3 pontos.",
  exortativo:"Sermao exortativo com diagnostico e chamado a mudanca em 3 pontos.",
  profetico:"Sermao profetico com mensagem de Deus e esperanca em 3 pontos.",
};

const ESTILO_INST = {
  original:"ESTILO: Homiletico natural e equilibrado. Linguagem clara, pastoral e biblica.",
  isaltino:"ESTILO (Isaltino Gomes Coelho Filho): Frases curtas e incisivas, perguntas retoricas, analise etimologica das palavras-chave, tom professoral e pastoral, densidade biblica e cristocentrica.",
  billy:"ESTILO (Billy Graham): Linguagem simples, frases curtas, tom urgente, apelo evangelistico forte, foco em decisao espiritual.",
};

const DIRETRIZ = "TEOLOGIA BATISTA: Use Ceia do Senhor, Ordenancas, Igreja local, salvacao pela graca mediante a fe. Sem sacramentalismo. Autoridade das Escrituras, centralidade de Cristo, conversao pessoal, sacerdocio dos crentes.";

const CATS_TEMAS = ["Familia","Discipulado","Sofrimento","Oracao","Santidade","Evangelismo","Lideranca","Juventude","Missoes","Avivamento","Esperanca","Vida Crista","Temas Atuais"];
const CAL_OCAS = ["Natal","Pascoa","Pentecostes","Semana da Familia","Conferencia Missionaria","Aniversario da Igreja","Culto de Gratidao","Batismo","Ceia do Senhor","Inicio de Ano","Encerramento de Ano","Retiro Espiritual","Congresso de Jovens","Semana de Oracao"];
const TIPOS_ILUST = ["Biblica","Cotidiano","Historica","Pastoral","Evangelistica","Missionaria"];
const ESTILOS_REF = [
  { id:"original",    label:"Original",     desc:"Apenas refina clareza e fluidez, preserva a voz do pregador." },
  { id:"isaltino",    label:"Isaltino",     desc:"Exegese equilibrada, clareza pastoral, profundidade." },
  { id:"billy",       label:"Billy Graham", desc:"Evangelistico, direto, apelo forte, urgencia espiritual." },
  { id:"lloydJones",  label:"Lloyd-Jones",  desc:"Profundidade doutrinaria, argumentacao intensa." },
  { id:"spurgeon",    label:"Spurgeon",     desc:"Riqueza ilustrativa, eloquencia pastoral, cristocentrico." },
  { id:"cosmovisao",  label:"Cosmovisao",   desc:"Exposicao biblica que interpreta toda a realidade a luz das Escrituras. Une exegese, apologetica e aplicacao cultural." },
];
const TIPOS_REF = ["Expositivo","Devocional","Evangelistico","Doutrinario","Biografico","Exortativo","Tematico"];
const INTENSIDADES = ["Leve","Moderado","Forte"];

const rn = n => ["I","II","III","IV","V"][n-1] || n;

async function loadSermons() { try { const r = await window.storage.get("sermons-list"); return r ? JSON.parse(r.value) : []; } catch { return []; } }
async function saveSermons(l) { try { await window.storage.set("sermons-list", JSON.stringify(l)); } catch {} }

async function callAPI(system, content, tokens) {
  tokens = tokens || 8000;
  let data, att = 0;
  while (att < 4) {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:tokens, system, messages:[{role:"user",content}] })
    });
    data = await r.json();
    if (!data.error || data.error.type !== "overloaded_error") break;
    att++; if (att < 4) await new Promise(r => setTimeout(r, 3000*att));
  }
  if (data.error) throw new Error(data.error.message || "Erro da API");
  const raw = (data.content||[]).map(i => i.text||"").join("");
  const m = raw.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("Resposta invalida da API.");
  return JSON.parse(m[0]);
}

async function callAPIChat(system, messages, tokens) {
  tokens = tokens || 4000;
  let data, att = 0;
  while (att < 4) {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:tokens, system, messages })
    });
    data = await r.json();
    if (!data.error || data.error.type !== "overloaded_error") break;
    att++; if (att < 4) await new Promise(r => setTimeout(r, 3000*att));
  }
  if (data.error) throw new Error(data.error.message || "Erro da API");
  return (data.content||[]).map(i => i.text||"").join("");
}

function buildMainSys(versao, estilo, perfilIgreja, perfilPublico, duracao) {
  const v = VERSOES.find(x => x.id === versao) || VERSOES[0];
  const pi = PERFIS_IGREJA.find(x => x.id === perfilIgreja);
  const pp = PERFIS_PUBLICO.find(x => x.id === perfilPublico);
  const dur = DURACOES.find(x => x.id === duracao);
  const instrPI = pi ? pi.instrucao : "";
  const instrPP = pp ? ("PERFIL DO PUBLICO: " + pp.label + ". Adapte linguagem, profundidade, exemplos, aplicacoes e intensidade do apelo para este publico.") : "";
  const instrDur = dur ? dur.instrucao : "";
  return "Voce e assistente de homiletica evangelica batista. " + (ESTILO_INST[estilo]||ESTILO_INST.original) + " " + DIRETRIZ + " " + instrPI + " " + instrPP + " " + instrDur + " VERSAO BIBLICA: " + v.label + " " + v.desc + ". PROIBIDO citar pregadores ou teologos nominalmente. ILUSTRACOES: exatamente 2 no sermao todo (1 biblica + 1 cotidiano) em pontos diferentes. O sermao deve parecer preparado especificamente para esta congregacao. Responda SOMENTE com JSON valido sem markdown: {\"titulo\":\"...\",\"pericope\":\"...\",\"versao_biblica\":\"" + v.label + " - " + v.desc + "\",\"tema\":\"...\",\"introducao\":\"paragrafos por \\n\",\"pontos\":[{\"numero\":1,\"titulo\":\"...\",\"exposicao\":\"paragrafos por \\n\",\"ilustracao_biblica\":null,\"ilustracao_cotidiano\":null,\"fonte_ilustracao_cotidiano\":null,\"aplicacao\":\"...\"},{\"numero\":2,\"titulo\":\"...\",\"exposicao\":\"...\",\"ilustracao_biblica\":null,\"ilustracao_cotidiano\":null,\"fonte_ilustracao_cotidiano\":null,\"aplicacao\":\"...\"},{\"numero\":3,\"titulo\":\"...\",\"exposicao\":\"...\",\"ilustracao_biblica\":null,\"ilustracao_cotidiano\":null,\"fonte_ilustracao_cotidiano\":null,\"aplicacao\":\"...\"}],\"conclusao\":\"paragrafos por \\n\",\"apelo\":\"paragrafos por \\n\",\"referencias\":[{\"tipo\":\"Biblia\",\"descricao\":\"BIBLIA SAGRADA. " + v.desc + ". [cidade]: [editora], [ano].\"}]}";
}

const ESBOCO_SYS = "Assistente de homiletica batista. Gere APENAS esboco rapido - esqueleto para o pregador desenvolver. " + DIRETRIZ + " Sem longos paragrafos. JSON valido sem markdown: {\"titulo\":\"...\",\"pericope\":\"...\",\"tema\":\"...\",\"objetivo\":\"1 frase\",\"introducao_gancho\":\"...\",\"pontos\":[{\"numero\":1,\"titulo\":\"...\",\"ideia_central\":\"1-2 frases\",\"aplicacao\":\"1 frase\"},{\"numero\":2,\"titulo\":\"...\",\"ideia_central\":\"...\",\"aplicacao\":\"...\"},{\"numero\":3,\"titulo\":\"...\",\"ideia_central\":\"...\",\"aplicacao\":\"...\"}],\"conclusao_ideia\":\"...\",\"apelo_ideia\":\"...\"}";
const LEXICO_SYS = "Especialista em grego koine e hebraico biblico. Identifique 4-6 palavras-chave teologicamente relevantes. JSON valido sem markdown: {\"palavras\":[{\"original\":\"...\",\"transliteracao\":\"...\",\"idioma\":\"Grego ou Hebraico\",\"traducao\":\"...\",\"significado\":\"2-3 frases\"}]}";
const CHAT_SYS = "Exegeta e teologo evangelico batista. Responda com profundidade exegetica e contexto historico-teologico. " + DIRETRIZ + " Linguagem pastoral e acessivel.";
const COMP_SYS = "Especialista em traducao biblica comparativa. Compare versoes destacando diferencas importantes e implicacoes pastorais. JSON valido sem markdown: {\"passagem\":\"...\",\"versoes\":[{\"sigla\":\"...\",\"nome\":\"...\",\"texto\":\"...\"}],\"analise\":{\"palavras_chave\":[{\"palavra\":\"...\",\"observacao\":\"...\"}],\"observacoes_gerais\":\"...\"}}";
const MAPA_SYS = "Especialista em introducao biblica e hermeneutica. " + DIRETRIZ + " JSON valido sem markdown: {\"livro\":\"...\",\"autor\":\"...\",\"data_aproximada\":\"...\",\"destinatarios\":\"...\",\"local_escrita\":\"...\",\"contexto_historico\":\"...\",\"proposito\":\"...\",\"temas_centrais\":[\"...\"],\"estrutura_geral\":\"...\",\"panorama_teologico\":\"...\",\"texto_passagem\":\"...\"}";
const AVAL_SYS = "Especialista em avaliacao homiletica batista. " + DIRETRIZ + " JSON valido sem markdown: {\"nota_geral\":85,\"criterios\":[{\"nome\":\"Fidelidade ao texto biblico\",\"nota\":0,\"comentario\":\"...\"},{\"nome\":\"Coerencia expositiva\",\"nota\":0,\"comentario\":\"...\"},{\"nome\":\"Clareza estrutural\",\"nota\":0,\"comentario\":\"...\"},{\"nome\":\"Centralidade de Cristo\",\"nota\":0,\"comentario\":\"...\"},{\"nome\":\"Profundidade teologica\",\"nota\":0,\"comentario\":\"...\"},{\"nome\":\"Naturalidade pastoral\",\"nota\":0,\"comentario\":\"...\"},{\"nome\":\"Relevancia pratica\",\"nota\":0,\"comentario\":\"...\"},{\"nome\":\"Fluidez da linguagem\",\"nota\":0,\"comentario\":\"...\"}],\"pontos_fortes\":[\"...\"],\"pontos_melhoria\":[\"...\"],\"sugestoes_praticas\":[\"...\"]}";
const DINAM_SYS = "Pregador experiente em homiletica batista. Gere 5 dinamicas de envolvimento pastoral que tornem a pregacao mais participativa sem teatralizacao. " + DIRETRIZ + " JSON valido sem markdown: {\"dinamicas\":[{\"nome\":\"...\",\"tipo\":\"...\",\"momento\":\"...\",\"como_executar\":\"...\",\"objetivo\":\"...\",\"cuidados\":\"...\",\"duracao\":\"...\",\"participacao\":\"...\",\"impacto\":\"...\"}]}";
const SERIE_SYS = "Especialista em series expositivas batistas. " + DIRETRIZ + " JSON valido sem markdown: {\"titulo_serie\":\"...\",\"descricao\":\"...\",\"total_mensagens\":0,\"mensagens\":[{\"numero\":1,\"titulo\":\"...\",\"pericope\":\"...\",\"ideia_central\":\"...\",\"conexao_anterior\":null,\"aplicacao_geral\":\"...\"},{\"numero\":2,\"titulo\":\"...\",\"pericope\":\"...\",\"ideia_central\":\"...\",\"conexao_anterior\":\"...\",\"aplicacao_geral\":\"...\"}],\"objetivo_serie\":\"...\",\"aplicacao_serie\":\"...\"}";

function buildRefSys(estilo, tipo, versao, intensidade, preservar) {
  const v = VERSOES.find(x => x.id === versao) || VERSOES[0];
  const eObj = ESTILOS_REF.find(e => e.id === estilo) || ESTILOS_REF[0];
  const instEst = estilo === "original" ? "Apenas melhore clareza, fluidez e organizacao. NAO altere a identidade do pregador." : ("Refine no estilo " + eObj.label + " com intensidade " + intensidade + ". " + eObj.desc);
  return "Editor pastoral inteligente especializado em refinar sermons evangelicos batistas. " + instEst + " " + DIRETRIZ + " VERSAO BIBLICA: " + v.label + " " + v.desc + ". Atualize TODAS as citacoes para esta versao. Tipo de sermao: " + tipo + ". " + (preservar ? "PRESERVAR IDENTIDADE PASTORAL: mantenha vocabulario e voz do pregador original." : "") + " PROIBIDO: mudar doutrina, inventar interpretacoes, inserir cliches de IA. MELHORE: fluidez, argumentos, aplicacoes, transicoes, clareza, impacto. Texto final limpo sem asteriscos. JSON valido sem markdown: {\"titulo\":\"...\",\"pericope\":\"...\",\"versao_biblica\":\"" + v.label + " - " + v.desc + "\",\"tema\":\"...\",\"tipo\":\"" + tipo + "\",\"analise\":\"analise do original (2-3 paragrafos)\",\"melhorias\":[\"melhoria 1\",\"melhoria 2\"],\"introducao\":\"paragrafos por \\n\",\"pontos\":[{\"numero\":1,\"titulo\":\"...\",\"exposicao\":\"paragrafos por \\n\",\"aplicacao\":\"...\"},{\"numero\":2,\"titulo\":\"...\",\"exposicao\":\"...\",\"aplicacao\":\"...\"},{\"numero\":3,\"titulo\":\"...\",\"exposicao\":\"...\",\"aplicacao\":\"...\"}],\"conclusao\":\"paragrafos por \\n\",\"apelo\":\"paragrafos por \\n\"}";
}

function buildTemasSys(cat, isAtual) {
  const extras = isAtual ? ",\"problema_humano\":\"...\",\"conexao_evangelio\":\"...\"" : "";
  const item = "{\"titulo\":\"...\",\"texto\":\"...\",\"ideia_central\":\"...\",\"aplicacao\":\"...\"" + extras + "}";
  return "Especialista em homiletica batista. Gere 5 temas para " + cat + ". " + DIRETRIZ + " " + (isAtual ? "Temas contemporaneos com base biblica solida, nao autoajuda." : "") + " JSON valido sem markdown: {\"categoria\":\"" + cat + "\",\"sugestoes\":[" + item + "," + item + "," + item + "," + item + "," + item + "]}";
}

function buildCalSys() {
  return "Especialista pastoral batista. Sugerir temas e textos para ocasiao informada. " + DIRETRIZ + " JSON valido sem markdown: {\"ocasiao\":\"...\",\"contexto_pastoral\":\"...\",\"sugestoes\":[{\"titulo\":\"...\",\"texto\":\"...\",\"tipo_sermao\":\"...\",\"sinopse\":\"...\",\"aplicacao_pastoral\":\"...\"},{\"titulo\":\"...\",\"texto\":\"...\",\"tipo_sermao\":\"...\",\"sinopse\":\"...\",\"aplicacao_pastoral\":\"...\"},{\"titulo\":\"...\",\"texto\":\"...\",\"tipo_sermao\":\"...\",\"sinopse\":\"...\",\"aplicacao_pastoral\":\"...\"},{\"titulo\":\"...\",\"texto\":\"...\",\"tipo_sermao\":\"...\",\"sinopse\":\"...\",\"aplicacao_pastoral\":\"...\"},{\"titulo\":\"...\",\"texto\":\"...\",\"tipo_sermao\":\"...\",\"sinopse\":\"...\",\"aplicacao_pastoral\":\"...\"}],\"serie_sugerida\":{\"titulo\":\"...\",\"mensagens\":3,\"descricao\":\"...\"}}";
}

function buildIlustSys(tipo) {
  return "Especialista em homiletica pastoral batista. Gere 3 ilustracoes do tipo " + tipo + ". Evite exagero dramatico. JSON valido sem markdown: {\"ilustracoes\":[{\"tipo\":\"" + tipo + "\",\"titulo\":\"...\",\"descricao\":\"...\",\"referencia\":\"...\",\"aplicacao\":\"...\"},{\"tipo\":\"" + tipo + "\",\"titulo\":\"...\",\"descricao\":\"...\",\"referencia\":\"...\",\"aplicacao\":\"...\"},{\"tipo\":\"" + tipo + "\",\"titulo\":\"...\",\"descricao\":\"...\",\"referencia\":\"...\",\"aplicacao\":\"...\"}]}";
}

// UI Helpers
function ET({ value, onChange, multiline, style }) {
  style = style || {};
  const T = multiline ? "textarea" : "input";
  return <T value={value} onChange={e => onChange(e.target.value)} style={Object.assign({ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px dashed #7a5a15", borderRadius:6, padding:"8px 10px", color:"#f5e6c8", fontFamily:"Georgia,serif", fontSize:14, lineHeight:1.75, resize:multiline?"vertical":undefined, minHeight:multiline?90:undefined, outline:"none" }, style)} />;
}
function Ef({ label, children }) {
  return <div style={{ marginBottom:12 }}><div style={{ fontSize:11, color:G, letterSpacing:1, textTransform:"uppercase", marginBottom:5 }}>{label}</div>{children}</div>;
}
function Para({ txt }) {
  return (txt||"").split("\n").filter(Boolean).map((p,i) => <p key={i} style={{ lineHeight:1.85, fontSize:15, color:"#f0e0b8", marginBottom:11 }}>{p}</p>);
}
function Sec({ t }) { return <h3 style={{ color:G, fontSize:14, marginTop:0, letterSpacing:1 }}>+ {t}</h3>; }
function Card({ children }) { return <div style={{ background:"rgba(40,25,5,0.85)", border:"1px solid #5a3f10", borderRadius:12, padding:22 }}>{children}</div>; }
const bS = active => ({ padding:"8px 14px", borderRadius:20, border:"1px solid " + (active?G:"#5a3f10"), background:active?G:"transparent", color:active?D:G, fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif", fontWeight:active?"bold":"normal" });
const cS = active => ({ padding:"6px 12px", borderRadius:14, border:"1px solid " + (active?G:"#5a3f10"), background:active?"rgba(201,162,39,0.2)":"transparent", color:active?G:"#c0a060", fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif", fontWeight:active?"bold":"normal" });

function exportPDF(s) {
  const pts = (s.pontos||[]).map((pt,idx) => {
    const ib = pt.ilustracao_biblica ? `<div class="ilbox bib"><span class="il-label">Ilustracao Biblica</span>${pt.ilustracao_biblica}</div>` : "";
    const ic = pt.ilustracao_cotidiano ? `<div class="ilbox cot"><span class="il-label">Ilustracao do Cotidiano</span>${pt.ilustracao_cotidiano}</div>` : "";
    const apl = `<div class="aplic"><span class="il-label">Aplicacao Pastoral</span>${pt.aplicacao||""}</div>`;
    const divider = idx < (s.pontos||[]).length - 1 ? `<div class="pt-divider"></div>` : "";
    return `<div class="ponto"><div class="ponto-num">Ponto ${rn(pt.numero)}</div><h3 class="ponto-titulo">${pt.titulo}</h3>${(pt.exposicao||"").split("\n").filter(Boolean).map(p=>`<p>${p}</p>`).join("")}${ib}${ic}${apl}</div>${divider}`;
  }).join("");

  const refs = s.referencias && s.referencias.length ? `<div class="section"><div class="section-label">Referencias Bibliograficas</div>${s.referencias.map(r=>`<p class="ref-item">${r.descricao}</p>`).join("")}</div>` : "";
  const hist = s.historico && s.historico.length ? `<div class="section"><div class="section-label">Historico de Pregacao</div>${s.historico.map(h=>`<div class="hist-item"><strong>${h.data}</strong> &mdash; ${h.local}${h.evento?" &bull; "+h.evento:""}</div>`).join("")}</div>` : "";

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Cinzel:wght@400;600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'EB Garamond',Georgia,serif; font-size:12.5pt; color:#1c1409; background:#fff; padding:0; line-height:1.8; }

  /* CABECALHO */
  .header-bar { background:#1c1409; color:#e8d5a0; padding:10px 48px; display:flex; justify-content:space-between; align-items:center; font-size:9pt; letter-spacing:1.5px; text-transform:uppercase; }
  .header-bar .pastor { font-family:'Cinzel',serif; letter-spacing:2px; }
  .header-bar .titulo-mini { font-style:italic; color:#c9a227; }

  /* CAPA DO SERMAO */
  .sermon-cover { text-align:center; padding:52px 60px 40px; border-bottom:1px solid #d4b870; background:linear-gradient(180deg,#fdf8ee 0%,#fff 100%); }
  .cover-tipo { font-size:8.5pt; color:#9a7a30; letter-spacing:3px; text-transform:uppercase; margin-bottom:18px; font-family:'Cinzel',serif; }
  .cover-titulo { font-family:'Cinzel',serif; font-size:26pt; font-weight:600; color:#1c1409; line-height:1.2; margin-bottom:16px; }
  .cover-divider { width:60px; height:2px; background:#c9a227; margin:16px auto; }
  .cover-pericope { font-size:12pt; color:#7a5a20; letter-spacing:.5px; margin-bottom:6px; }
  .cover-versao { font-size:9pt; color:#a08040; letter-spacing:.5px; font-style:italic; margin-bottom:16px; }
  .cover-tema { font-size:12pt; font-style:italic; color:#3a2a10; border-left:3px solid #c9a227; padding:8px 16px; display:inline-block; text-align:left; margin-top:10px; background:#fdf8ee; }
  .cover-meta { margin-top:18px; font-size:9pt; color:#b09050; letter-spacing:1px; }

  /* CORPO */
  .body-wrap { padding:36px 60px 48px; }

  /* SECOES */
  .section { margin-bottom:30px; }
  .section-label { font-family:'Cinzel',serif; font-size:8pt; color:#c9a227; letter-spacing:3px; text-transform:uppercase; margin-bottom:14px; padding-bottom:6px; border-bottom:1px solid #e8d5a0; }

  /* PARAGRAFOS */
  p { margin-bottom:10pt; text-align:justify; }

  /* PONTOS */
  .ponto { margin-bottom:10px; }
  .ponto-num { font-family:'Cinzel',serif; font-size:8pt; color:#c9a227; letter-spacing:3px; text-transform:uppercase; margin-bottom:6px; }
  .ponto-titulo { font-size:14pt; font-weight:600; color:#1c1409; border-left:4px solid #c9a227; padding-left:14px; margin-bottom:16px; line-height:1.3; }
  .pt-divider { border:none; border-top:1px dashed #d4b870; margin:24px 0; }

  /* ILUSTRACOES */
  .ilbox { border-radius:4px; padding:12px 16px; margin:14px 0; }
  .ilbox.bib { background:#fdf8ee; border-left:3px solid #c9a227; font-style:italic; color:#4a3410; }
  .ilbox.cot { background:#f0f5ff; border-left:3px solid #6080b0; color:#1a2a4a; }
  .il-label { display:block; font-size:7.5pt; letter-spacing:2px; text-transform:uppercase; color:#9a7a30; margin-bottom:6px; font-style:normal; font-family:'Cinzel',serif; }
  .aplic { background:#f4fcf4; border-left:3px solid #60a060; padding:12px 16px; margin:14px 0; border-radius:4px; }
  .aplic .il-label { color:#406040; }

  /* APELO */
  .apelo-box { background:#faf8ff; border:1px solid #b090d0; border-left:4px solid #7050a0; border-radius:4px; padding:20px 24px; margin-top:10px; }
  .apelo-box .section-label { color:#7050a0; border-bottom-color:#c0a0e0; }

  /* RODAPE */
  .footer { text-align:center; margin-top:40px; padding-top:14px; border-top:1px solid #e8d5a0; font-size:8.5pt; color:#b09050; letter-spacing:1px; font-family:'Cinzel',serif; }

  /* REFS / HIST */
  .ref-item { font-size:10pt; margin-bottom:6px; color:#3a2a10; }
  .hist-item { padding:8px 14px; border-left:3px solid #c9a227; margin-bottom:8px; font-size:10pt; background:#fdf8ee; }
</style>
</head>
<body>

<!-- CABECALHO -->
<div class="header-bar">
  <span class="pastor">Pr. Fernando Veiga</span>
  <span class="titulo-mini">${s.titulo||""}</span>
</div>

<!-- CAPA -->
<div class="sermon-cover">
  <div class="cover-tipo">${s.tipo||"Sermao"} &bull; ${s.duracao||""}</div>
  <h1 class="cover-titulo">${s.titulo||""}</h1>
  <div class="cover-divider"></div>
  <div class="cover-pericope">${s.pericope||""}</div>
  <div class="cover-versao">${s.versao_biblica||""}</div>
  ${s.tema ? `<div class="cover-tema">${s.tema}</div>` : ""}
  ${(s.perfil_igreja||s.perfil_publico) ? `<div class="cover-meta">${[s.perfil_igreja,s.perfil_publico].filter(Boolean).join(" &bull; ")}</div>` : ""}
</div>

<!-- CORPO -->
<div class="body-wrap">

  <!-- INTRODUCAO -->
  <div class="section">
    <div class="section-label">Introducao</div>
    ${(s.introducao||"").split("\n").filter(Boolean).map(p=>`<p>${p}</p>`).join("")}
  </div>

  <!-- DESENVOLVIMENTO -->
  <div class="section">
    <div class="section-label">Desenvolvimento</div>
    ${pts}
  </div>

  <!-- CONCLUSAO -->
  <div class="section">
    <div class="section-label">Conclusao</div>
    ${(s.conclusao||"").split("\n").filter(Boolean).map(p=>`<p>${p}</p>`).join("")}
  </div>

  <!-- APELO -->
  <div class="apelo-box">
    <div class="section-label">Apelo</div>
    ${(s.apelo||"").split("\n").filter(Boolean).map(p=>`<p>${p}</p>`).join("")}
  </div>

  ${refs}
  ${hist}

  <div class="footer">Sermoes e Mensagens &bull; Pr. Fernando Veiga</div>
</div>

</body>
</html>`;

  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([html],{type:"text/html"})),
    download: "sermao-" + (s.pericope||"export").replace(/[\s.:]/g,"-") + ".html",
    style: "display:none"
  });
  (document.body||document.documentElement).appendChild(a);
  a.click();
  setTimeout(() => a.remove(), 500);
}

function HistModal({ sermon, onSave, onClose }) {
  const [local, setLocal] = useState(""), [evento, setEvento] = useState(""), [data, setData] = useState(new Date().toLocaleDateString("pt-BR"));
  const hist = sermon.historico||[];
  const add = () => { if (!local.trim()) return; onSave([...hist,{data,local,evento}]); setLocal(""); setEvento(""); };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#2a1c05", border:"1px solid " + G, borderRadius:12, padding:24, width:"100%", maxWidth:480, maxHeight:"80vh", overflowY:"auto" }}>
        <h3 style={{ color:G, fontSize:16, margin:"0 0 14px" }}>Historico de Pregacao</h3>
        {hist.length===0 ? <p style={{ color:"#7a5a30", fontStyle:"italic", fontSize:13, marginBottom:12 }}>Nenhuma pregacao registrada.</p>
          : hist.map((h,i) => <div key={i} style={{ background:"rgba(201,162,39,0.08)", border:"1px solid #5a3f10", borderRadius:8, padding:10, marginBottom:8, display:"flex", justifyContent:"space-between" }}>
            <div><div style={{ fontSize:12, color:G }}>{h.data}</div><div style={{ fontSize:14, color:"#f0e0b8" }}>{h.local}</div>{h.evento&&<div style={{ fontSize:12, color:"#a08040", fontStyle:"italic" }}>{h.evento}</div>}</div>
            <button onClick={() => onSave(hist.filter((_,j) => j!==i))} style={{ background:"none", border:"none", color:"#e08080", cursor:"pointer" }}>X</button>
          </div>)}
        <div style={{ borderTop:"1px solid #5a3f10", paddingTop:12, display:"grid", gap:8 }}>
          {[{v:data,s:setData,p:"Data"},{v:local,s:setLocal,p:"Igreja / Local *"},{v:evento,s:setEvento,p:"Evento (opcional)"}].map((f,i) =>
            <input key={i} value={f.v} onChange={e => f.s(e.target.value)} placeholder={f.p} style={{ padding:"8px 12px", borderRadius:6, border:"1px solid #7a5a15", background:"rgba(255,255,255,0.05)", color:"#f5e6c8", fontFamily:"Georgia,serif", fontSize:13, outline:"none" }} />)}
          <button onClick={add} disabled={!local.trim()} style={{ padding:"9px", borderRadius:6, border:"none", background:local.trim() ? "linear-gradient(135deg," + G + ",#a07820)" : "#6b5010", color:D, fontWeight:"bold", fontSize:13, cursor:local.trim()?"pointer":"not-allowed", fontFamily:"Georgia,serif" }}>+ Adicionar</button>
        </div>
        <button onClick={onClose} style={{ marginTop:10, width:"100%", padding:"8px", borderRadius:6, border:"1px solid #5a3f10", background:"transparent", color:"#a08040", fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif" }}>Fechar</button>
      </div>
    </div>
  );
}

function Apresentacao({ sermon, onClose }) {
  const [idx, setIdx] = useState(0), [fs, setFs] = useState(28);
  const slides = [
    { tipo:"capa" },
    { tipo:"texto", label:"INTRODUCAO", conteudo:sermon.introducao },
    ...(sermon.pontos||[]).map(pt => ({ tipo:"ponto", pt })),
    { tipo:"texto", label:"CONCLUSAO", conteudo:sermon.conclusao },
    { tipo:"apelo", conteudo:sermon.apelo },
  ];
  const sl = slides[idx];
  return (
    <div style={{ position:"fixed", inset:0, background:"#080604", zIndex:300, display:"flex", flexDirection:"column", color:"#f5e6c8" }}>
      <div style={{ display:"flex", gap:8, padding:"8px 16px", background:"rgba(0,0,0,0.6)", alignItems:"center", flexWrap:"wrap" }}>
        <button onClick={onClose} style={{ padding:"5px 12px", borderRadius:16, border:"1px solid #5a3f10", background:"transparent", color:G, fontSize:12, cursor:"pointer" }}>X Fechar</button>
        <button onClick={() => setIdx(i => Math.max(i-1,0))} disabled={idx===0} style={{ padding:"5px 12px", borderRadius:16, border:"1px solid #5a3f10", background:"transparent", color:G, fontSize:12, cursor:"pointer" }}>Anterior</button>
        <span style={{ fontSize:12, color:"#7a5a30" }}>{idx+1}/{slides.length}</span>
        <button onClick={() => setIdx(i => Math.min(i+1,slides.length-1))} disabled={idx===slides.length-1} style={{ padding:"5px 12px", borderRadius:16, border:"1px solid #5a3f10", background:"transparent", color:G, fontSize:12, cursor:"pointer" }}>Proximo</button>
        <div style={{ marginLeft:"auto", display:"flex", gap:5 }}>
          {[22,28,34,40].map(f => <button key={f} onClick={() => setFs(f)} style={{ padding:"3px 7px", borderRadius:6, border:"1px solid " + (fs===f?G:"#5a3f10"), background:fs===f?"rgba(201,162,39,0.2)":"transparent", color:fs===f?G:"#7a5a30", fontSize:11, cursor:"pointer" }}>{f}</button>)}
        </div>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 60px", overflowY:"auto" }}>
        {sl.tipo==="capa" && <div style={{ textAlign:"center" }}><div style={{ fontSize:13, color:G, letterSpacing:3, marginBottom:14 }}>{sermon.pericope}</div><div style={{ fontSize:fs+10, color:"#f0d080", fontWeight:"bold", lineHeight:1.3, marginBottom:18 }}>{sermon.titulo}</div><div style={{ fontSize:fs-6, color:"#a08040", fontStyle:"italic" }}>{sermon.tema}</div><div style={{ fontSize:13, color:"#7a5a30", marginTop:20 }}>Pr. Fernando Veiga</div></div>}
        {sl.tipo==="texto" && <div style={{ maxWidth:860, width:"100%" }}><div style={{ fontSize:12, color:G, letterSpacing:3, marginBottom:18 }}>{sl.label}</div><div style={{ fontSize:fs, lineHeight:1.8, color:"#f0e0b8" }}>{(sl.conteudo||"").split("\n").filter(Boolean).join("\n\n")}</div></div>}
        {sl.tipo==="ponto" && <div style={{ maxWidth:860, width:"100%" }}><div style={{ fontSize:12, color:G, letterSpacing:3, marginBottom:8 }}>PONTO {rn(sl.pt.numero)}</div><div style={{ fontSize:fs+4, color:"#f0d080", fontWeight:"bold", borderLeft:"4px solid " + G, paddingLeft:20, marginBottom:22 }}>{sl.pt.titulo}</div><div style={{ fontSize:fs, lineHeight:1.8, color:"#f0e0b8" }}>{(sl.pt.exposicao||"").split("\n").filter(Boolean).join("\n\n")}</div>{sl.pt.aplicacao&&<div style={{ background:"rgba(40,80,40,0.2)", border:"1px solid #3a6030", borderRadius:8, padding:14, marginTop:12, fontSize:fs-4, color:"#c0e0c0" }}>{sl.pt.aplicacao}</div>}</div>}
        {sl.tipo==="apelo" && <div style={{ maxWidth:860, width:"100%", background:"rgba(80,50,120,0.15)", border:"2px solid #7050a0", borderRadius:16, padding:40 }}><div style={{ fontSize:12, color:"#b090e0", letterSpacing:3, marginBottom:18 }}>APELO</div><div style={{ fontSize:fs, lineHeight:1.8, color:"#e0d0f8" }}>{(sl.conteudo||"").split("\n").filter(Boolean).join("\n\n")}</div></div>}
      </div>
      <div style={{ display:"flex", gap:4, padding:"8px", justifyContent:"center" }}>
        {slides.map((_,i) => <button key={i} onClick={() => setIdx(i)} style={{ width:10, height:10, borderRadius:"50%", border:"none", background:i===idx?G:"#3a2a08", cursor:"pointer", padding:0 }} />)}
      </div>
    </div>
  );
}

function PainelEsboco() {
  const [p, setP] = useState(""), [esboco, setEsboco] = useState(null), [loading, setLoading] = useState(false), [error, setError] = useState("");
  const gerar = async () => { if (!p.trim()) return; setLoading(true); setError(""); setEsboco(null); try { const r = await callAPI(ESBOCO_SYS, "Esboco para: " + p, 2000); setEsboco(r); } catch(e) { setError("Erro: " + e.message); } setLoading(false); };
  const copiar = () => { if (!esboco) return; const t = ["ESBOCO - " + esboco.pericope, "Titulo: " + esboco.titulo, "Tema: " + esboco.tema, "", ...(esboco.pontos||[]).map(pt => "PONTO " + rn(pt.numero) + " - " + pt.titulo + "\n  Ideia: " + pt.ideia_central + "\n  Aplicacao: " + pt.aplicacao), "", "Conclusao: " + esboco.conclusao_ideia, "Apelo: " + esboco.apelo_ideia].join("\n"); navigator.clipboard.writeText(t).catch(() => {}); };
  return <div>
    <p style={{ fontSize:13, color:"#a08040", marginBottom:14, fontStyle:"italic" }}>Gera apenas o esqueleto para voce desenvolver com suas proprias palavras.</p>
    <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
      <input value={p} onChange={e => setP(e.target.value)} onKeyDown={e => e.key==="Enter"&&gerar()} placeholder="Ex: Romanos 8.1-11 ou tema: A graca de Deus..." style={{ flex:1, minWidth:200, padding:"10px 14px", borderRadius:8, border:"1px solid #8a6a20", background:D, color:"#f5e6c8", fontSize:14, fontFamily:"Georgia,serif", outline:"none" }} />
      <button onClick={gerar} disabled={loading||!p.trim()} style={{ padding:"10px 20px", borderRadius:8, border:"none", background:loading?"#6b5010":"linear-gradient(135deg," + G + ",#a07820)", color:D, fontWeight:"bold", fontSize:14, cursor:loading?"not-allowed":"pointer", fontFamily:"Georgia,serif" }}>{loading?"...":"Gerar"}</button>
    </div>
    {error&&<p style={{ color:"#e07070", fontSize:13 }}>{error}</p>}
    {esboco&&<div style={{ background:"rgba(40,25,5,0.8)", border:"1px solid #5a3f10", borderRadius:10, padding:18 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, flexWrap:"wrap", gap:8 }}>
        <div><div style={{ fontSize:11, color:G, letterSpacing:1, marginBottom:3 }}>{esboco.pericope}</div><div style={{ fontSize:17, color:"#f0d080", fontWeight:"bold" }}>{esboco.titulo}</div><div style={{ fontSize:13, color:"#a08040", fontStyle:"italic" }}>{esboco.tema}</div></div>
        <button onClick={copiar} style={{ padding:"6px 12px", borderRadius:8, border:"1px solid " + G, background:"transparent", color:G, fontSize:12, cursor:"pointer" }}>Copiar</button>
      </div>
      {(esboco.pontos||[]).map((pt,i) => <div key={i} style={{ background:"rgba(201,162,39,0.06)", border:"1px solid #4a3508", borderRadius:8, padding:12, marginBottom:8 }}>
        <div style={{ fontSize:14, color:"#f0d080", fontWeight:"bold", borderLeft:"3px solid " + G, paddingLeft:10, marginBottom:8 }}>Ponto {rn(pt.numero)} - {pt.titulo}</div>
        <div style={{ fontSize:11, color:G, marginBottom:3 }}>IDEIA</div><p style={{ margin:"0 0 8px", fontSize:13, color:"#e0d0a0" }}>{pt.ideia_central}</p>
        <div style={{ fontSize:11, color:"#80c080", marginBottom:3 }}>APLICACAO</div><p style={{ margin:0, fontSize:13, color:"#c0e0c0" }}>{pt.aplicacao}</p>
      </div>)}
    </div>}
  </div>;
}

function PainelIlustracoes() {
  const [ponto, setPonto] = useState(""), [tipo, setTipo] = useState("Biblica"), [result, setResult] = useState(null), [loading, setLoading] = useState(false), [error, setError] = useState("");
  const gerar = async () => { if (!ponto.trim()) return; setLoading(true); setError(""); setResult(null); try { const r = await callAPI(buildIlustSys(tipo), "Ponto: " + ponto, 3000); setResult(r); } catch(e) { setError("Erro: " + e.message); } setLoading(false); };
  return <div>
    <p style={{ fontSize:13, color:"#a08040", marginBottom:14, fontStyle:"italic" }}>Descreva um ponto e escolha o tipo de ilustracao.</p>
    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>{TIPOS_ILUST.map(t => <button key={t} onClick={() => { setTipo(t); setResult(null); }} style={cS(tipo===t)}>{t}</button>)}</div>
    <textarea value={ponto} onChange={e => setPonto(e.target.value)} placeholder="Ex: O poder transformador da graca de Deus (Efesios 2.1-10)" style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid #8a6a20", background:D, color:"#f5e6c8", fontSize:14, fontFamily:"Georgia,serif", outline:"none", minHeight:70, resize:"vertical", marginBottom:10 }} />
    <button onClick={gerar} disabled={loading||!ponto.trim()} style={{ padding:"10px 20px", borderRadius:8, border:"none", background:loading?"#6b5010":"linear-gradient(135deg," + G + ",#a07820)", color:D, fontWeight:"bold", fontSize:14, cursor:loading?"not-allowed":"pointer", fontFamily:"Georgia,serif" }}>{loading?"...":"Gerar Ilustracoes"}</button>
    {error&&<p style={{ color:"#e07070", fontSize:13, marginTop:8 }}>{error}</p>}
    {result&&(result.ilustracoes||[]).map((il,i) => <div key={i} style={{ background:"rgba(40,25,5,0.8)", border:"1px solid " + G + "40", borderLeft:"4px solid " + G, borderRadius:10, padding:14, marginTop:12 }}>
      <div style={{ fontSize:15, color:"#f0d080", fontWeight:"bold", marginBottom:6 }}>{il.titulo}</div>
      <p style={{ margin:"0 0 6px", fontSize:13, color:"#e0d0a0", lineHeight:1.75 }}>{il.descricao}</p>
      {il.aplicacao&&<div style={{ background:"rgba(40,80,40,0.2)", border:"1px solid #3a6030", borderRadius:6, padding:8, fontSize:13, color:"#c0e0c0" }}>{il.aplicacao}</div>}
    </div>)}
  </div>;
}

function PainelCalendario() {
  const [oc, setOc] = useState(null), [result, setResult] = useState(null), [loading, setLoading] = useState(false), [error, setError] = useState("");
  const gerar = async () => { if (!oc) return; setLoading(true); setError(""); setResult(null); try { const r = await callAPI(buildCalSys(), "Ocasiao: " + oc, 4000); setResult(r); } catch(e) { setError("Erro: " + e.message); } setLoading(false); };
  return <div>
    <p style={{ fontSize:13, color:"#a08040", marginBottom:14, fontStyle:"italic" }}>Selecione uma ocasiao e receba sugestoes de temas e textos.</p>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:7, marginBottom:14 }}>
      {CAL_OCAS.map(o => <button key={o} onClick={() => { setOc(o); setResult(null); }} style={{ padding:"9px 10px", borderRadius:8, border:"1px solid " + (oc===o?G:"#5a3f10"), background:oc===o?"rgba(201,162,39,0.15)":"transparent", color:oc===o?G:"#c0a060", fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif", textAlign:"left" }}>{o}</button>)}
    </div>
    {oc&&<button onClick={gerar} disabled={loading} style={{ padding:"10px 20px", borderRadius:8, border:"none", background:loading?"#6b5010":"linear-gradient(135deg," + G + ",#a07820)", color:D, fontWeight:"bold", fontSize:14, cursor:loading?"not-allowed":"pointer", fontFamily:"Georgia,serif", marginBottom:14 }}>{loading?"...":"Gerar Sugestoes"}</button>}
    {error&&<p style={{ color:"#e07070", fontSize:13 }}>{error}</p>}
    {result&&<div>
      <div style={{ background:"rgba(40,25,5,0.8)", border:"1px solid #5a3f10", borderRadius:10, padding:14, marginBottom:14 }}><div style={{ fontSize:15, color:"#f0d080", fontWeight:"bold", marginBottom:6 }}>{result.ocasiao}</div><p style={{ margin:0, fontSize:13, color:"#d4c090", fontStyle:"italic" }}>{result.contexto_pastoral}</p></div>
      {(result.sugestoes||[]).map((s,i) => <div key={i} style={{ background:"rgba(40,25,5,0.6)", border:"1px solid #4a3508", borderRadius:10, padding:14, marginBottom:10 }}>
        <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:8 }}><div style={{ fontSize:15, color:"#f0d080", fontWeight:"bold" }}>{s.titulo}</div><span style={{ fontSize:12, background:"rgba(201,162,39,0.2)", color:G, padding:"2px 10px", borderRadius:12 }}>{s.texto}</span></div>
        <p style={{ margin:"0 0 8px", fontSize:13, color:"#e0d0a0" }}>{s.sinopse}</p>
        <div style={{ background:"rgba(40,80,40,0.2)", border:"1px solid #3a6030", borderRadius:6, padding:8, fontSize:13, color:"#c0e0c0" }}>{s.aplicacao_pastoral}</div>
      </div>)}
    </div>}
  </div>;
}

function PainelTemas() {
  const [cat, setCat] = useState(null), [result, setResult] = useState(null), [loading, setLoading] = useState(false), [error, setError] = useState("");
  const gerar = async () => { if (!cat) return; setLoading(true); setError(""); setResult(null); const ia = cat==="Temas Atuais"; try { const r = await callAPI(buildTemasSys(cat,ia), "Categoria: " + cat, 4000); setResult(r); } catch(e) { setError("Erro: " + e.message); } setLoading(false); };
  return <div>
    <p style={{ fontSize:13, color:"#a08040", marginBottom:14, fontStyle:"italic" }}>Selecione uma categoria e receba sugestoes de temas.</p>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:7, marginBottom:14 }}>
      {CATS_TEMAS.map(c => { const ia=c==="Temas Atuais"; const cor=ia?"#9070c0":G; return <button key={c} onClick={() => { setCat(c); setResult(null); }} style={{ padding:"9px 10px", borderRadius:8, border:"1px solid " + (cat===c?cor:"#5a3f10"), background:cat===c?"rgba(" + (ia?"144,112,192":"201,162,39") + ",0.15)":"transparent", color:cat===c?cor:"#c0a060", fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif", textAlign:"left" }}>{ia?"* ":""}{c}</button>; })}
    </div>
          {cat&&<button onClick={gerar} disabled={loading} style={{ padding:"10px 20px", borderRadius:8, border:"none", background:loading?"#6b5010":"linear-gradient(135deg," + G + ",#a07820)", color:D, fontWeight:"bold", fontSize:14, cursor:loading?"not-allowed":"pointer", fontFamily:"Georgia,serif", marginBottom:14 }}>{loading?"...":"Gerar Temas"}</button>}
      
    {error&&<p style={{ color:"#e07070", fontSize:13 }}>{error}</p>}
    {result&&(result.sugestoes||[]).map((s,i) => { const ia=cat==="Temas Atuais"; return <div key={i} style={{ background:"rgba(40,25,5,0.8)", border:"1px solid " + (ia?"#7050a0":"#5a3f10"), borderRadius:10, padding:14, marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:8 }}><div style={{ fontSize:15, color:"#f0d080", fontWeight:"bold" }}>{s.titulo}</div><span style={{ fontSize:12, background:"rgba(201,162,39,0.2)", color:G, padding:"2px 10px", borderRadius:12 }}>{s.texto}</span></div>
      {ia&&s.problema_humano&&<div style={{ marginBottom:8 }}><div style={{ fontSize:11, color:"#e08080", marginBottom:3 }}>PROBLEMA</div><p style={{ margin:0, fontSize:13, color:"#e0b0b0" }}>{s.problema_humano}</p></div>}
      {ia&&s.conexao_evangelio&&<div style={{ marginBottom:8 }}><div style={{ fontSize:11, color:"#80c080", marginBottom:3 }}>EVANGELHO</div><p style={{ margin:0, fontSize:13, color:"#b0e0b0" }}>{s.conexao_evangelio}</p></div>}
      <div style={{ marginBottom:8 }}><div style={{ fontSize:11, color:G, marginBottom:3 }}>IDEIA</div><p style={{ margin:0, fontSize:13, color:"#e0d0a0" }}>{s.ideia_central}</p></div>
      <div style={{ background:"rgba(40,80,40,0.2)", border:"1px solid #3a6030", borderRadius:6, padding:8 }}><div style={{ fontSize:11, color:"#80c080", marginBottom:3 }}>APLICACAO</div><p style={{ margin:0, fontSize:13, color:"#c0e0c0" }}>{s.aplicacao}</p></div>
    </div>; })}
  </div>;
}

function PainelSerie() {
  const [entrada, setEntrada] = useState(""), [result, setResult] = useState(null), [loading, setLoading] = useState(false), [error, setError] = useState("");
  const gerar = async () => { if (!entrada.trim()) return; setLoading(true); setError(""); setResult(null); try { const r = await callAPI(SERIE_SYS, "Serie expositiva para: " + entrada, 6000); setResult(r); } catch(e) { setError("Erro: " + e.message); } setLoading(false); };
  return <div>
    <p style={{ fontSize:13, color:"#a08040", marginBottom:14, fontStyle:"italic" }}>Informe um livro biblico, tema ou campanha para gerar uma serie expositiva.</p>
    <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
      <input value={entrada} onChange={e => setEntrada(e.target.value)} onKeyDown={e => e.key==="Enter"&&gerar()} placeholder="Ex: Filipenses, Serie sobre Fe, Campanha de Missoes..." style={{ flex:1, minWidth:200, padding:"10px 14px", borderRadius:8, border:"1px solid #8a6a20", background:D, color:"#f5e6c8", fontSize:14, fontFamily:"Georgia,serif", outline:"none" }} />
      <button onClick={gerar} disabled={loading||!entrada.trim()} style={{ padding:"10px 20px", borderRadius:8, border:"none", background:loading?"#6b5010":"linear-gradient(135deg," + G + ",#a07820)", color:D, fontWeight:"bold", fontSize:14, cursor:loading?"not-allowed":"pointer", fontFamily:"Georgia,serif" }}>{loading?"...":"Gerar Serie"}</button>
    </div>
    {error&&<p style={{ color:"#e07070", fontSize:13 }}>{error}</p>}
    {result&&<div>
      <div style={{ background:"linear-gradient(135deg,#3d2a08,#2a1c05)", border:"1px solid " + G, borderRadius:10, padding:16, marginBottom:14 }}>
        <div style={{ fontSize:11, color:G, letterSpacing:1, marginBottom:4 }}>SERIE - {result.total_mensagens} MENSAGENS</div>
        <div style={{ fontSize:18, color:"#f0d080", fontWeight:"bold", marginBottom:6 }}>{result.titulo_serie}</div>
        <p style={{ margin:"0 0 8px", fontSize:13, color:"#d4c090" }}>{result.descricao}</p>
      </div>
      {(result.mensagens||[]).map((m,i) => <div key={i} style={{ background:"rgba(40,25,5,0.8)", border:"1px solid #5a3f10", borderRadius:10, padding:14, marginBottom:10 }}>
        <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:8 }}><div><div style={{ fontSize:11, color:G, marginBottom:3 }}>MENSAGEM {m.numero}</div><div style={{ fontSize:15, color:"#f0d080", fontWeight:"bold" }}>{m.titulo}</div></div><span style={{ fontSize:12, background:"rgba(201,162,39,0.2)", color:G, padding:"2px 10px", borderRadius:12 }}>{m.pericope}</span></div>
        <p style={{ margin:"0 0 6px", fontSize:13, color:"#e0d0a0" }}>{m.ideia_central}</p>
        {m.aplicacao_geral&&<div style={{ background:"rgba(40,80,40,0.2)", border:"1px solid #3a6030", borderRadius:6, padding:8, fontSize:13, color:"#c0e0c0" }}>{m.aplicacao_geral}</div>}
      </div>)}
    </div>}
  </div>;
}

function PainelRefinador({ onSaveLibrary }) {
  const [texto, setTexto] = useState(""), [nomeArq, setNomeArq] = useState(""), [estilo, setEstilo] = useState("original"), [tipo, setTipo] = useState("Expositivo"), [versao, setVersao] = useState("ARC"), [intensidade, setIntensidade] = useState("Moderado"), [duracao, setDuracao] = useState("30min"), [preservar, setPreservar] = useState(true), [result, setResult] = useState(null), [loading, setLoading] = useState(false), [error, setError] = useState(""), [activeTab, setActiveTab] = useState("analise"), [salvoMsg, setSalvoMsg] = useState("");

  const salvarNaBiblioteca = async () => {
    if (!result) return;
    const s = { id:Date.now(), savedAt:new Date().toLocaleDateString("pt-BR"), titulo:result.titulo, pericope:result.pericope, tema:result.tema, versao_biblica:result.versao_biblica, tipo:result.tipo||tipo, introducao:result.introducao||"", conclusao:result.conclusao||"", apelo:result.apelo||"", pontos:(result.pontos||[]).map(pt => Object.assign({},pt,{ilustracao_biblica:null,ilustracao_cotidiano:null,fonte_ilustracao_cotidiano:null})), referencias:[{tipo:"Biblia",descricao:"BIBLIA SAGRADA. " + result.versao_biblica + ". [cidade]: [editora], [ano]."}], lexico:null, historico:[], estilo };
    try { await onSaveLibrary(s); setSalvoMsg("Sermao refinado salvo na Biblioteca!"); setTimeout(() => setSalvoMsg(""), 3000); } catch(e) { setSalvoMsg("Erro ao salvar: " + e.message); setTimeout(() => setSalvoMsg(""), 3000); }
  };

  const handleFile = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setNomeArq(file.name); setResult(null); setError("");
    const ext = file.name.split(".").pop().toLowerCase();
    try {
      if (ext==="txt") { setTexto(await file.text()); }
      else if (ext==="pdf") {
        const arr = await file.arrayBuffer();
        const bytes = new Uint8Array(arr);
        let bin = ""; for (let i=0;i<bytes.length;i++) bin+=String.fromCharCode(bytes[i]);
        setTexto("__PDF__" + btoa(bin));
      } else { setError("Use PDF ou TXT. Para DOCX, cole o texto diretamente."); }
    } catch { setError("Erro ao ler o arquivo."); }
  };

  const refinar = async () => {
    if (!texto.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const sys = buildRefSys(estilo, tipo, versao, intensidade, preservar);
      let msgs;
      if (texto.startsWith("__PDF__")) {
        const b64 = texto.replace("__PDF__","");
        msgs = [{role:"user",content:[{type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}},{type:"text",text:"Leia o sermao neste PDF e refine-o. Tipo: " + tipo + ". Estilo: " + estilo + ". Intensidade: " + intensidade + ". Preservar identidade: " + (preservar?"sim":"nao") + "."}]}];
      } else {
        msgs = [{role:"user",content:"Leia e refine este sermao:\n\n" + texto.trim().slice(0,12000) + "\n\nTipo: " + tipo + ". Estilo: " + estilo + ". Intensidade: " + intensidade + ". Preservar identidade: " + (preservar?"sim":"nao") + "."}];
      }
      let data, att=0;
      while (att<4) {
        const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:8000,system:sys,messages:msgs})});
        data = await r.json();
        if (!data.error||data.error.type!=="overloaded_error") break;
        att++; if(att<4) await new Promise(r=>setTimeout(r,3000*att));
      }
      if (data.error) throw new Error(data.error.message||"Erro interno da API.");
      const raw = (data.content||[]).map(i=>i.text||"").join("");
      const m = raw.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("Resposta invalida da API.");
      setResult(JSON.parse(m[0])); setActiveTab("analise");
    } catch(e) { setError("Erro: " + e.message); }
    setLoading(false);
  };

  const exportarTxt = () => {
    if (!result) return;
    const pts = (result.pontos||[]).map(pt => "\nPONTO " + rn(pt.numero) + " - " + pt.titulo + "\n\n" + (pt.exposicao||"") + "\n\nAplicacao: " + (pt.aplicacao||"")).join("\n---\n");
    const t = ["SERMAO REFINADO", result.titulo, result.pericope + " | " + result.versao_biblica, "Tema: " + result.tema, "\nINTRODUCAO\n", result.introducao||"", "\nDESENVOLVIMENTO\n", pts, "\nCONCLUSAO\n", result.conclusao||"", "\nAPELO\n", result.apelo||"", "\nPr. Fernando Veiga"].join("\n");
    const a = Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([t],{type:"text/plain;charset=utf-8"})),download:"sermao-refinado.txt",style:"display:none"});
    (document.body||document.documentElement).appendChild(a); a.click(); setTimeout(()=>a.remove(),500);
  };

  const para = txt => (txt||"").split("\n").filter(Boolean).map((p,i) => <p key={i} style={{ lineHeight:1.85, fontSize:15, color:"#f0e0b8", marginBottom:11 }}>{p}</p>);
  const TABS = result ? [["analise","Analise"],["introducao","Introducao"],["pontos","Pontos"],["conclusao","Conclusao"],["apelo","Apelo"]] : [];

  return <div>
    <p style={{ fontSize:13, color:"#a08040", marginBottom:18, fontStyle:"italic" }}>Importe um sermao existente e a IA ira analisa-lo e refina-lo com profundidade pastoral.</p>
    {salvoMsg&&<div style={{ background:"#2a4a2a", border:"1px solid #60a060", borderRadius:8, padding:"10px 16px", marginBottom:12, color:"#90e090", fontSize:14 }}>{salvoMsg}</div>}
    <div style={{ background:"rgba(201,162,39,0.06)", border:"2px dashed #7a5a15", borderRadius:10, padding:20, marginBottom:18, textAlign:"center" }}>
      <div style={{ fontSize:14, color:"#d4c090", marginBottom:12 }}>Importe seu sermao (PDF ou TXT)</div>
      <label style={{ padding:"9px 20px", borderRadius:8, border:"1px solid " + G, background:"rgba(201,162,39,0.15)", color:G, fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif" }}>
        Escolher Arquivo
        <input type="file" accept=".pdf,.txt" onChange={handleFile} style={{ display:"none" }} />
      </label>
      {nomeArq&&<div style={{ marginTop:10, fontSize:12, color:"#80c080" }}>Carregado: {nomeArq}</div>}
      <div style={{ margin:"12px 0 6px", fontSize:12, color:"#7a5a30" }}>- ou cole o texto do sermao diretamente -</div>
      <textarea value={texto.startsWith("__")?"":texto} onChange={e => { setTexto(e.target.value); setNomeArq(""); }} placeholder="Cole aqui o texto do seu sermao..." style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid #5a3f10", background:D, color:"#f5e6c8", fontSize:13, fontFamily:"Georgia,serif", outline:"none", minHeight:100, resize:"vertical" }} />
    </div>
    <div style={{ display:"grid", gap:16, marginBottom:18 }}>
      <div>
        <div style={{ fontSize:12, color:G, letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Estilo de Pregacao</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:5 }}>{ESTILOS_REF.map(e => <button key={e.id} onClick={() => setEstilo(e.id)} style={cS(estilo===e.id)}>{e.label}</button>)}</div>
        <p style={{ fontSize:12, color:"#8a6a30", fontStyle:"italic", margin:0 }}>{(ESTILOS_REF.find(e => e.id===estilo)||{}).desc}</p>
      </div>
      {estilo!=="original"&&<div>
        <div style={{ fontSize:12, color:G, letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Intensidade</div>
        <div style={{ display:"flex", gap:6 }}>{INTENSIDADES.map(i => <button key={i} onClick={() => setIntensidade(i)} style={cS(intensidade===i)}>{i}</button>)}</div>
      </div>}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div>
          <div style={{ fontSize:12, color:G, letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Tipo de Sermao</div>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{TIPOS_REF.map(t => <button key={t} onClick={() => setTipo(t)} style={Object.assign({},cS(tipo===t),{fontSize:12})}>{t}</button>)}</div>
        </div>
        <div>
          <div style={{ fontSize:12, color:G, letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Versao Biblica</div>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{VERSOES.map(v => <button key={v.id} onClick={() => setVersao(v.id)} style={Object.assign({},cS(versao===v.id),{fontSize:12})}>{v.id}</button>)}</div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div onClick={() => setPreservar(p => !p)} style={{ width:42, height:24, borderRadius:12, background:preservar?G:"#5a3f10", cursor:"pointer", position:"relative" }}>
          <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:preservar?21:3, transition:"left 0.2s" }} />
        </div>
        <div><div style={{ fontSize:13, color:preservar?G:"#7a5a30", fontWeight:preservar?"bold":"normal" }}>Preservar minha identidade pastoral</div><div style={{ fontSize:11, color:"#7a5a30" }}>A IA apenas refina sem descaracterizar sua voz</div></div>
      </div>
    </div>
    <button onClick={refinar} disabled={loading||!texto.trim()} style={{ padding:"11px 28px", borderRadius:8, border:"none", background:loading||!texto.trim()?"#6b5010":"linear-gradient(135deg," + G + ",#a07820)", color:D, fontWeight:"bold", fontSize:15, cursor:loading||!texto.trim()?"not-allowed":"pointer", fontFamily:"Georgia,serif" }}>{loading?"Refinando o sermao...":"Refinar Sermao"}</button>
    {error&&<p style={{ color:"#e07070", fontSize:13, marginTop:10 }}>{error}</p>}
    {result&&<div style={{ marginTop:22 }}>
      <div style={{ background:"linear-gradient(135deg,#3d2a08,#2a1c05)", border:"1px solid " + G, borderRadius:12, padding:18, marginBottom:14, textAlign:"center" }}>
        <div style={{ fontSize:11, color:"#a08040", letterSpacing:2, textTransform:"uppercase", marginBottom:3 }}>{result.tipo} - {result.pericope}</div>
        <h2 style={{ margin:"0 0 6px", fontSize:20, color:"#f0d080" }}>{result.titulo}</h2>
        <div style={{ height:1, background:G, margin:"10px auto", width:56 }} />
        <p style={{ margin:"0 0 3px", fontSize:13, fontStyle:"italic", color:"#d4b060" }}>{result.tema}</p>
        <p style={{ margin:0, fontSize:11, color:"#7a6030" }}>{result.versao_biblica}</p>
      </div>
      {result.tipo && result.tipo.toLowerCase()!==tipo.toLowerCase()&&<div style={{ background:"rgba(201,162,39,0.12)", border:"1px solid " + G, borderRadius:8, padding:"10px 14px", marginBottom:12 }}><span style={{ fontSize:12, color:"#f0d080" }}>Atencao: O sermao foi identificado como {result.tipo}, mas o tipo selecionado era {tipo}. O refinamento foi aplicado conforme o tipo identificado.</span></div>}
      <div style={{ display:"flex", gap:6, justifyContent:"flex-end", marginBottom:12 }}>
        <button onClick={salvarNaBiblioteca} style={Object.assign({},bS(false),{borderColor:G,color:G})}>Salvar na Biblioteca</button>
        <button onClick={exportarTxt} style={bS(false)}>Exportar TXT</button>
      </div>
      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>{TABS.map(([id,lbl]) => <button key={id} onClick={() => setActiveTab(id)} style={bS(activeTab===id)}>{lbl}</button>)}</div>
      <div style={{ background:"rgba(40,25,5,0.85)", border:"1px solid #5a3f10", borderRadius:12, padding:22 }}>
        {activeTab==="analise"&&<><h3 style={{ color:G, fontSize:14, marginTop:0 }}>ANALISE DO SERMAO ORIGINAL</h3>{para(result.analise)}{result.melhorias&&result.melhorias.length>0&&<><h3 style={{ color:G, fontSize:14 }}>MELHORIAS REALIZADAS</h3>{result.melhorias.map((m,i) => <p key={i} style={{ margin:"0 0 6px", fontSize:13, color:"#c0e0c0" }}>- {m}</p>)}</>}</>}
        {activeTab==="introducao"&&<><h3 style={{ color:G, fontSize:14, marginTop:0 }}>INTRODUCAO</h3>{para(result.introducao)}</>}
        {activeTab==="pontos"&&(result.pontos||[]).map(pt => <div key={pt.numero} style={{ marginBottom:24 }}>
          <h3 style={{ color:"#f0d080", fontSize:15, marginTop:0, borderLeft:"3px solid " + G, paddingLeft:12 }}>Ponto {rn(pt.numero)} - {pt.titulo}</h3>
          {para(pt.exposicao)}
          <div style={{ background:"rgba(40,80,40,0.2)", border:"1px solid #3a6030", borderRadius:8, padding:12 }}><div style={{ fontSize:11, color:"#80c080", marginBottom:5 }}>APLICACAO</div><p style={{ margin:0, fontSize:14, color:"#c0e0c0" }}>{pt.aplicacao}</p></div>
          {pt.numero<(result.pontos||[]).length&&<div style={{ height:1, background:"#3a2a08", margin:"20px 0" }} />}
        </div>)}
        {activeTab==="conclusao"&&<><h3 style={{ color:G, fontSize:14, marginTop:0 }}>CONCLUSAO</h3>{para(result.conclusao)}</>}
        {activeTab==="apelo"&&<div style={{ background:"rgba(80,50,120,0.15)", border:"2px solid #7050a0", borderRadius:10, padding:20 }}><h3 style={{ color:G, fontSize:14, marginTop:0 }}>APELO</h3>{para(result.apelo)}</div>}
      </div>
    </div>}
  </div>;
}

function PainelChat() {
  const [texto, setTexto] = useState(""), [msgs, setMsgs] = useState([]), [input, setInput] = useState(""), [loading, setLoading] = useState(false), [error, setError] = useState("");
  const PQ = ["Qual o contexto historico?","O que significa esta palavra no original?","Qual a ideia central do texto?","Como este texto aponta para Cristo?","Quais os principais erros de interpretacao?","Qual a aplicacao pastoral?"];
  const enviar = async (pergunta) => {
    const p = pergunta||input.trim(); if (!p||!texto.trim()) return;
    const nm = [...msgs,{role:"user",content:"Texto: " + texto + "\nPergunta: " + p}];
    setMsgs(nm); setInput(""); setLoading(true); setError("");
    try { const resp = await callAPIChat(CHAT_SYS, nm, 3000); setMsgs([...nm,{role:"assistant",content:resp}]); } catch(e) { setError("Erro: " + e.message); }
    setLoading(false);
  };
  return <div>
    <p style={{ fontSize:13, color:"#a08040", marginBottom:14, fontStyle:"italic" }}>Informe um texto biblico e faca perguntas exegeticas.</p>
    <input value={texto} onChange={e => setTexto(e.target.value)} placeholder="Ex: Romanos 8.1-11" style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid #8a6a20", background:D, color:"#f5e6c8", fontSize:14, fontFamily:"Georgia,serif", outline:"none", marginBottom:10 }} />
    <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>{PQ.map(pq => <button key={pq} onClick={() => enviar(pq)} disabled={!texto.trim()||loading} style={{ padding:"5px 10px", borderRadius:14, border:"1px solid #5a3f10", background:"transparent", color:"#c0a060", fontSize:12, cursor:"pointer", fontFamily:"Georgia,serif" }}>{pq}</button>)}</div>
    {msgs.length>0&&<div style={{ maxHeight:380, overflowY:"auto", marginBottom:10 }}>
      {msgs.map((m,i) => <div key={i} style={{ marginBottom:10, padding:"10px 14px", borderRadius:10, background:m.role==="user"?"rgba(201,162,39,0.1)":"rgba(40,25,5,0.8)", border:"1px solid " + (m.role==="user"?"#7a5a15":"#4a3508") }}>
        <div style={{ fontSize:11, color:m.role==="user"?G:"#80c080", marginBottom:5 }}>{m.role==="user"?"Voce":"Exegeta"}</div>
        <div style={{ fontSize:13, color:"#e0d0a0", lineHeight:1.75, whiteSpace:"pre-wrap" }}>{m.role==="user"?m.content.split("\nPergunta: ")[1]:m.content}</div>
      </div>)}
      {loading&&<p style={{ color:"#a08040", fontStyle:"italic", padding:10 }}>Analisando...</p>}
    </div>}
    {error&&<p style={{ color:"#e07070", fontSize:13 }}>{error}</p>}
    <div style={{ display:"flex", gap:8 }}>
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter"&&enviar()} placeholder="Digite sua pergunta..." disabled={!texto.trim()} style={{ flex:1, padding:"10px 14px", borderRadius:8, border:"1px solid #8a6a20", background:D, color:"#f5e6c8", fontSize:14, fontFamily:"Georgia,serif", outline:"none" }} />
      <button onClick={() => enviar()} disabled={loading||!input.trim()||!texto.trim()} style={{ padding:"10px 18px", borderRadius:8, border:"none", background:"linear-gradient(135deg," + G + ",#a07820)", color:D, fontWeight:"bold", fontSize:14, cursor:"pointer", fontFamily:"Georgia,serif" }}>OK</button>
    </div>
    {msgs.length>0&&<button onClick={() => setMsgs([])} style={{ marginTop:8, padding:"5px 12px", borderRadius:14, border:"1px solid #5a3f10", background:"transparent", color:"#7a5a30", fontSize:12, cursor:"pointer", fontFamily:"Georgia,serif" }}>Limpar</button>}
  </div>;
}

function PainelComparacao() {
  const [passagem, setPassagem] = useState(""), [result, setResult] = useState(null), [loading, setLoading] = useState(false), [error, setError] = useState("");
  const gerar = async () => { if (!passagem.trim()) return; setLoading(true); setError(""); setResult(null); try { const r = await callAPI(COMP_SYS, "Compare as versoes ARC, ACF, NAA, NVI, KJA e SBTB da passagem: " + passagem, 6000); setResult(r); } catch(e) { setError("Erro: " + e.message); } setLoading(false); };
  return <div>
    <p style={{ fontSize:13, color:"#a08040", marginBottom:14, fontStyle:"italic" }}>Visualize a passagem em multiplas versoes com analise comparativa.</p>
    <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
      <input value={passagem} onChange={e => setPassagem(e.target.value)} onKeyDown={e => e.key==="Enter"&&gerar()} placeholder="Ex: Joao 3.16 ou Romanos 8.1" style={{ flex:1, minWidth:200, padding:"10px 14px", borderRadius:8, border:"1px solid #8a6a20", background:D, color:"#f5e6c8", fontSize:14, fontFamily:"Georgia,serif", outline:"none" }} />
      <button onClick={gerar} disabled={loading||!passagem.trim()} style={{ padding:"10px 20px", borderRadius:8, border:"none", background:loading?"#6b5010":"linear-gradient(135deg," + G + ",#a07820)", color:D, fontWeight:"bold", fontSize:14, cursor:loading?"not-allowed":"pointer", fontFamily:"Georgia,serif" }}>{loading?"...":"Comparar"}</button>
    </div>
    {error&&<p style={{ color:"#e07070", fontSize:13 }}>{error}</p>}
    {result&&<div>
      <div style={{ display:"grid", gap:8, marginBottom:14 }}>
        {(result.versoes||[]).map((v,i) => <div key={i} style={{ background:"rgba(40,25,5,0.8)", border:"1px solid #5a3f10", borderRadius:8, padding:12 }}>
          <div style={{ fontSize:11, color:G, letterSpacing:1, marginBottom:5 }}>{v.sigla} - {v.nome}</div>
          <p style={{ margin:0, fontSize:14, color:"#f0e0b8", lineHeight:1.8, fontStyle:"italic" }}>{v.texto}</p>
        </div>)}
      </div>
      {result.analise&&<div style={{ background:"rgba(30,20,5,0.8)", border:"1px solid #4a3508", borderRadius:10, padding:16 }}>
        <div style={{ fontSize:12, color:G, letterSpacing:1, marginBottom:10 }}>ANALISE COMPARATIVA</div>
        {(result.analise.palavras_chave||[]).map((pk,i) => <div key={i} style={{ marginBottom:8, paddingLeft:10, borderLeft:"2px solid #7a5a15" }}><span style={{ color:"#f0d080", fontWeight:"bold" }}>{pk.palavra}</span> - <span style={{ fontSize:13, color:"#d4c090" }}>{pk.observacao}</span></div>)}
        {result.analise.observacoes_gerais&&<p style={{ margin:"10px 0 0", fontSize:14, color:"#e0d0a0", lineHeight:1.8 }}>{result.analise.observacoes_gerais}</p>}
      </div>}
    </div>}
  </div>;
}

function PainelMapa() {
  const [entrada, setEntrada] = useState(""), [result, setResult] = useState(null), [loading, setLoading] = useState(false), [error, setError] = useState("");
  const gerar = async () => { if (!entrada.trim()) return; setLoading(true); setError(""); setResult(null); try { const r = await callAPI(MAPA_SYS, "Livro/Passagem: " + entrada, 4000); setResult(r); } catch(e) { setError("Erro: " + e.message); } setLoading(false); };
  return <div>
    <p style={{ fontSize:13, color:"#a08040", marginBottom:14, fontStyle:"italic" }}>Informe um livro ou passagem para visualizar o contexto historico e literario.</p>
    <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
      <input value={entrada} onChange={e => setEntrada(e.target.value)} onKeyDown={e => e.key==="Enter"&&gerar()} placeholder="Ex: Livro de Romanos ou Romanos 8.1-11" style={{ flex:1, minWidth:200, padding:"10px 14px", borderRadius:8, border:"1px solid #8a6a20", background:D, color:"#f5e6c8", fontSize:14, fontFamily:"Georgia,serif", outline:"none" }} />
      <button onClick={gerar} disabled={loading||!entrada.trim()} style={{ padding:"10px 20px", borderRadius:8, border:"none", background:loading?"#6b5010":"linear-gradient(135deg," + G + ",#a07820)", color:D, fontWeight:"bold", fontSize:14, cursor:loading?"not-allowed":"pointer", fontFamily:"Georgia,serif" }}>{loading?"...":"Gerar Mapa"}</button>
    </div>
    {error&&<p style={{ color:"#e07070", fontSize:13 }}>{error}</p>}
    {result&&<div>
      <div style={{ background:"linear-gradient(135deg,#3d2a08,#2a1c05)", border:"1px solid " + G, borderRadius:10, padding:16, marginBottom:12 }}>
        <div style={{ fontSize:18, color:"#f0d080", fontWeight:"bold", marginBottom:10 }}>{result.livro}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[["Autor",result.autor],["Data",result.data_aproximada],["Destinatarios",result.destinatarios],["Local",result.local_escrita],["Proposito",result.proposito]].filter(c => c[1]).map(([l,v],i) => <div key={i}><div style={{ fontSize:11, color:G, marginBottom:2 }}>{l}</div><div style={{ fontSize:13, color:"#e0d0a0" }}>{v}</div></div>)}
        </div>
      </div>
      {result.temas_centrais&&result.temas_centrais.length>0&&<div style={{ marginBottom:12 }}><div style={{ fontSize:11, color:G, letterSpacing:1, marginBottom:7 }}>TEMAS CENTRAIS</div><div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>{result.temas_centrais.map((t,i) => <span key={i} style={{ background:"rgba(201,162,39,0.15)", border:"1px solid #7a5a15", borderRadius:14, padding:"4px 12px", fontSize:13, color:"#f0d080" }}>{t}</span>)}</div></div>}
      {[["CONTEXTO HISTORICO",result.contexto_historico],["ESTRUTURA GERAL",result.estrutura_geral],["PANORAMA TEOLOGICO",result.panorama_teologico],["CONTEXTO DA PASSAGEM",result.texto_passagem]].filter(x => x[1]).map(([l,v],i) => <div key={i} style={{ marginBottom:12 }}><div style={{ fontSize:11, color:G, letterSpacing:1, marginBottom:5 }}>{l}</div><p style={{ margin:0, fontSize:14, color:"#e0d0a0", lineHeight:1.8 }}>{v}</p></div>)}
    </div>}
  </div>;
}

function PainelDinamicas({ sermon }) {
  const [result, setResult] = useState(null), [loading, setLoading] = useState(false), [error, setError] = useState("");
  const gerar = async () => {
    if (!sermon) return; setLoading(true); setError(""); setResult(null);
    const resumo = "Titulo: " + sermon.titulo + "\nPassagem: " + sermon.pericope + "\nTema: " + sermon.tema + "\nPontos: " + (sermon.pontos||[]).map(p => p.titulo + ": " + (p.exposicao||"").slice(0,100)).join(" | ");
    try { const r = await callAPI(DINAM_SYS, "Gere 5 dinamicas de envolvimento pastoral para este sermao:\n\n" + resumo, 5000); setResult(r); } catch(e) { setError("Erro: " + e.message); }
    setLoading(false);
  };
  if (!sermon) return <p style={{ color:"#7a5a30", fontStyle:"italic" }}>Gere um sermao primeiro.</p>;
  return <div>
    <p style={{ fontSize:13, color:"#a08040", marginBottom:14, fontStyle:"italic" }}>Sugestoes para tornar a pregacao mais participativa e memoravel sem teatralizacao.</p>
    {!result&&!loading&&<button onClick={gerar} style={{ padding:"11px 24px", borderRadius:8, border:"none", background:"linear-gradient(135deg," + G + ",#a07820)", color:D, fontWeight:"bold", fontSize:14, cursor:"pointer", fontFamily:"Georgia,serif" }}>Gerar Dinamicas de Envolvimento</button>}
    {loading&&<p style={{ color:"#a08040", fontStyle:"italic" }}>Elaborando sugestoes pastorais...</p>}
    {error&&<p style={{ color:"#e07070", fontSize:13 }}>{error}</p>}
    {result&&<div>
      {(result.dinamicas||[]).map((d,i) => <div key={i} style={{ background:"rgba(40,25,5,0.85)", borderLeft:"4px solid " + G, borderRadius:10, padding:18, marginBottom:14 }}>
        <div style={{ fontSize:15, color:"#f0d080", fontWeight:"bold", marginBottom:5 }}>{d.nome}</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}><span style={{ fontSize:11, background:"rgba(201,162,39,0.2)", color:G, padding:"2px 9px", borderRadius:10 }}>{d.tipo}</span><span style={{ fontSize:11, color:"#8a6a30", background:"rgba(60,40,10,0.4)", padding:"2px 9px", borderRadius:10 }}>{d.momento}</span><span style={{ fontSize:11, color:"#888", background:"rgba(60,40,10,0.3)", padding:"2px 9px", borderRadius:10 }}>{d.duracao}</span></div>
        <div style={{ background:"rgba(201,162,39,0.06)", borderRadius:8, padding:10, marginBottom:8 }}><div style={{ fontSize:11, color:G, marginBottom:4 }}>COMO EXECUTAR</div><p style={{ margin:0, fontSize:13, color:"#e0d0a0", lineHeight:1.75 }}>{d.como_executar}</p></div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          <div style={{ background:"rgba(40,80,40,0.2)", border:"1px solid #3a6030", borderRadius:8, padding:10 }}><div style={{ fontSize:11, color:"#80c080", marginBottom:4 }}>OBJETIVO</div><p style={{ margin:0, fontSize:13, color:"#c0e0c0" }}>{d.objetivo}</p></div>
          <div style={{ background:"rgba(80,50,20,0.2)", border:"1px solid #6a4020", borderRadius:8, padding:10 }}><div style={{ fontSize:11, color:"#e0a060", marginBottom:4 }}>CUIDADOS</div><p style={{ margin:0, fontSize:13, color:"#e0c0a0" }}>{d.cuidados}</p></div>
        </div>
      </div>)}
      <button onClick={() => setResult(null)} style={{ padding:"6px 12px", borderRadius:14, border:"1px solid #5a3f10", background:"transparent", color:"#7a5a30", fontSize:12, cursor:"pointer", fontFamily:"Georgia,serif" }}>Gerar novamente</button>
    </div>}
  </div>;
}

function PainelAvaliacao({ sermon, onAplicarMelhorias }) {
  const [result, setResult] = useState(null), [loading, setLoading] = useState(false), [loadingMelh, setLoadingMelh] = useState(false), [error, setError] = useState(""), [msgMelh, setMsgMelh] = useState("");
  const corN = n => n>=80?"#80c080":n>=60?G:"#e08080";

  const avaliar = async () => {
    setLoading(true); setError(""); setResult(null);
    const txt = "Titulo: " + sermon.titulo + "\nPassagem: " + sermon.pericope + "\nTema: " + sermon.tema + "\nIntroducao: " + sermon.introducao + "\nPontos: " + (sermon.pontos||[]).map(p => p.titulo + ": " + p.exposicao + " | Aplicacao: " + p.aplicacao).join("\n") + "\nConclusao: " + sermon.conclusao + "\nApelo: " + sermon.apelo;
    try { const r = await callAPI(AVAL_SYS, txt, 4000); setResult(r); } catch(e) { setError("Erro: " + e.message); }
    setLoading(false);
  };

  const aplicarMelhorias = async () => {
    if (!result || !onAplicarMelhorias) return;
    setLoadingMelh(true); setError(""); setMsgMelh("");
    const melhorias = [
      ...(result.pontos_melhoria||[]),
      ...(result.sugestoes_praticas||[]),
    ].join("; ");
    const sys = "Voce e um editor pastoral especializado em homiléetica batista. Voce recebera um sermao e uma lista de melhorias e sugestoes identificadas por uma avaliacao homiletica. Aplique TODAS as melhorias e sugestoes no sermao, preservando a estrutura, doutrina, tom e identidade pastoral original. " + DIRETRIZ + " Responda SOMENTE com JSON valido sem markdown, mantendo a mesma estrutura: {\"titulo\":\"...\",\"pericope\":\"...\",\"versao_biblica\":\"...\",\"tema\":\"...\",\"introducao\":\"paragrafos por \\n\",\"pontos\":[{\"numero\":1,\"titulo\":\"...\",\"exposicao\":\"paragrafos por \\n\",\"ilustracao_biblica\":null,\"ilustracao_cotidiano\":null,\"fonte_ilustracao_cotidiano\":null,\"aplicacao\":\"...\"},{\"numero\":2,\"titulo\":\"...\",\"exposicao\":\"...\",\"ilustracao_biblica\":null,\"ilustracao_cotidiano\":null,\"fonte_ilustracao_cotidiano\":null,\"aplicacao\":\"...\"},{\"numero\":3,\"titulo\":\"...\",\"exposicao\":\"...\",\"ilustracao_biblica\":null,\"ilustracao_cotidiano\":null,\"fonte_ilustracao_cotidiano\":null,\"aplicacao\":\"...\"}],\"conclusao\":\"paragrafos por \\n\",\"apelo\":\"paragrafos por \\n\",\"referencias\":[]}";
    const prompt = "Aplique as seguintes melhorias e sugestoes neste sermao:\n\nMELHORIAS A APLICAR:\n" + melhorias + "\n\nSERMAO ORIGINAL:\nTitulo: " + sermon.titulo + "\nPassagem: " + sermon.pericope + "\nTema: " + sermon.tema + "\nIntroducao:\n" + sermon.introducao + "\n\nPontos:\n" + (sermon.pontos||[]).map(p => "Ponto " + rn(p.numero) + " - " + p.titulo + ":\n" + p.exposicao + "\nAplicacao: " + p.aplicacao).join("\n\n") + "\n\nConclusao:\n" + sermon.conclusao + "\n\nApelo:\n" + sermon.apelo;
    try {
      const melhorado = await callAPI(sys, prompt, 8000);
      melhorado.id = sermon.id;
      melhorado.savedAt = sermon.savedAt;
      melhorado.tipo = sermon.tipo;
      melhorado.estilo = sermon.estilo;
      melhorado.perfil_igreja = sermon.perfil_igreja;
      melhorado.perfil_publico = sermon.perfil_publico;
      melhorado.duracao = sermon.duracao;
      melhorado.lexico = sermon.lexico;
      melhorado.historico = sermon.historico;
      melhorado.pontos = Array.isArray(melhorado.pontos) ? melhorado.pontos : sermon.pontos;
      melhorado.referencias = Array.isArray(melhorado.referencias) ? melhorado.referencias : sermon.referencias;
      onAplicarMelhorias(melhorado);
      setMsgMelh("Melhorias aplicadas com sucesso no sermao!");
      setTimeout(() => setMsgMelh(""), 3000);
    } catch(e) { setError("Erro ao aplicar melhorias: " + e.message); }
    setLoadingMelh(false);
  };

  if (!sermon) return <p style={{ color:"#7a5a30", fontStyle:"italic" }}>Gere um sermao primeiro para avalia-lo.</p>;
  return <div>
    {!result&&!loading&&<div><p style={{ fontSize:13, color:"#a08040", marginBottom:14, fontStyle:"italic" }}>O sistema analisara a qualidade homiletica e biblica do sermao.</p><button onClick={avaliar} style={{ padding:"11px 24px", borderRadius:8, border:"none", background:"linear-gradient(135deg," + G + ",#a07820)", color:D, fontWeight:"bold", fontSize:14, cursor:"pointer", fontFamily:"Georgia,serif" }}>Avaliar Sermao</button></div>}
    {loading&&<p style={{ color:"#a08040", fontStyle:"italic" }}>Analisando o sermao...</p>}
    {error&&<p style={{ color:"#e07070", fontSize:13 }}>{error}</p>}
    {msgMelh&&<div style={{ background:"#2a4a2a", border:"1px solid #60a060", borderRadius:8, padding:"10px 16px", marginBottom:12, color:"#90e090", fontSize:14 }}>{msgMelh}</div>}
    {result&&<div>
      <div style={{ textAlign:"center", marginBottom:18, padding:14, background:"rgba(40,25,5,0.8)", border:"1px solid #5a3f10", borderRadius:10 }}>
        <div style={{ fontSize:11, color:G, marginBottom:4 }}>NOTA GERAL</div>
        <div style={{ fontSize:44, fontWeight:"bold", color:corN(result.nota_geral) }}>{result.nota_geral}<span style={{ fontSize:20, color:"#7a5a30" }}>/100</span></div>
      </div>
      <div style={{ display:"grid", gap:7, marginBottom:14 }}>
        {(result.criterios||[]).map((c,i) => <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(30,20,5,0.6)", border:"1px solid #4a3508", borderRadius:8, padding:10 }}>
          <div><div style={{ fontSize:13, color:"#f0e0b8" }}>{c.nome}</div><div style={{ fontSize:12, color:"#8a6a30", marginTop:2 }}>{c.comentario}</div></div>
          <div style={{ fontSize:18, fontWeight:"bold", color:corN(c.nota), minWidth:36, textAlign:"right" }}>{c.nota}</div>
        </div>)}
      </div>
      {result.pontos_fortes&&result.pontos_fortes.length>0&&<div style={{ marginBottom:10 }}><div style={{ fontSize:11, color:"#80c080", letterSpacing:1, marginBottom:6 }}>PONTOS FORTES</div>{result.pontos_fortes.map((p,i) => <p key={i} style={{ margin:"0 0 5px", fontSize:13, color:"#c0e0c0" }}>+ {p}</p>)}</div>}
      {result.pontos_melhoria&&result.pontos_melhoria.length>0&&<div style={{ marginBottom:10 }}><div style={{ fontSize:11, color:"#e08080", letterSpacing:1, marginBottom:6 }}>MELHORIAS IDENTIFICADAS</div>{result.pontos_melhoria.map((p,i) => <p key={i} style={{ margin:"0 0 5px", fontSize:13, color:"#e0b0b0" }}>- {p}</p>)}</div>}
      {result.sugestoes_praticas&&result.sugestoes_praticas.length>0&&<div style={{ background:"rgba(80,50,120,0.15)", border:"1px solid #7050a0", borderRadius:8, padding:12, marginBottom:14 }}><div style={{ fontSize:11, color:"#b090e0", letterSpacing:1, marginBottom:6 }}>SUGESTOES PRATICAS</div>{result.sugestoes_praticas.map((s,i) => <p key={i} style={{ margin:"0 0 5px", fontSize:13, color:"#c0a0e0" }}>- {s}</p>)}</div>}

      {/* Botao aplicar melhorias */}
      {((result.pontos_melhoria&&result.pontos_melhoria.length>0)||(result.sugestoes_praticas&&result.sugestoes_praticas.length>0))&&(
        <div style={{ background:"rgba(201,162,39,0.08)", border:"1px solid " + G, borderRadius:10, padding:16, marginBottom:14 }}>
          <div style={{ fontSize:13, color:"#f0d080", fontWeight:"bold", marginBottom:6 }}>Aplicar melhorias automaticamente</div>
          <p style={{ fontSize:12, color:"#a08040", marginBottom:12 }}>A IA ira reescrever o sermao aplicando todas as melhorias e sugestoes identificadas, preservando a estrutura, doutrina e identidade pastoral.</p>
          <button onClick={aplicarMelhorias} disabled={loadingMelh}
            style={{ padding:"10px 24px", borderRadius:8, border:"none", background:loadingMelh?"#6b5010":"linear-gradient(135deg," + G + ",#a07820)", color:D, fontWeight:"bold", fontSize:14, cursor:loadingMelh?"not-allowed":"pointer", fontFamily:"Georgia,serif" }}>
            {loadingMelh?"Aplicando melhorias...":"Aplicar Melhorias no Sermao"}
          </button>
        </div>
      )}

      <button onClick={() => setResult(null)} style={{ padding:"6px 12px", borderRadius:14, border:"1px solid #5a3f10", background:"transparent", color:"#7a5a30", fontSize:12, cursor:"pointer", fontFamily:"Georgia,serif" }}>Nova avaliacao</button>
    </div>}
  </div>;
}

function SermonContent({ sermon, tab }) {
  const para = txt => (txt||"").split("\n").filter(Boolean).map((p,i) => <p key={i} style={{ lineHeight:1.85, fontSize:15, color:"#f0e0b8", marginBottom:11 }}>{p}</p>);
  return (
    <div style={{ background:"rgba(40,25,5,0.85)", border:"1px solid #5a3f10", borderRadius:12, padding:22 }}>
      {tab==="introducao"&&<><h3 style={{ color:G, fontSize:14, marginTop:0 }}>INTRODUCAO</h3>{para(sermon.introducao)}</>}
      {tab==="pontos"&&(sermon.pontos||[]).map(pt => <div key={pt.numero} style={{ marginBottom:26 }}>
        <h3 style={{ color:"#f0d080", fontSize:15, marginTop:0, borderLeft:"3px solid " + G, paddingLeft:12 }}>Ponto {rn(pt.numero)} - {pt.titulo}</h3>
        {para(pt.exposicao)}
        {pt.ilustracao_biblica&&<div style={{ background:"rgba(201,162,39,0.08)", border:"1px solid #7a5a15", borderRadius:8, padding:12, marginBottom:8 }}><div style={{ fontSize:11, color:G, letterSpacing:1, marginBottom:5 }}>ILUSTRACAO BIBLICA</div><p style={{ margin:0, lineHeight:1.8, fontSize:14, fontStyle:"italic", color:"#d4c090" }}>{pt.ilustracao_biblica}</p></div>}
        {pt.ilustracao_cotidiano&&<div style={{ background:"rgba(30,60,100,0.2)", border:"1px solid #4060a0", borderRadius:8, padding:12, marginBottom:8 }}><div style={{ fontSize:11, color:"#80a0e0", letterSpacing:1, marginBottom:5 }}>ILUSTRACAO DO COTIDIANO</div><p style={{ margin:0, lineHeight:1.8, fontSize:14, color:"#c0d0f0" }}>{pt.ilustracao_cotidiano}</p></div>}
        <div style={{ background:"rgba(40,80,40,0.2)", border:"1px solid #3a6030", borderRadius:8, padding:12 }}><div style={{ fontSize:11, color:"#80c080", letterSpacing:1, marginBottom:5 }}>APLICACAO</div><p style={{ margin:0, lineHeight:1.8, fontSize:14, color:"#c0e0c0" }}>{pt.aplicacao}</p></div>
        {pt.numero<(sermon.pontos||[]).length&&<div style={{ height:1, background:"#3a2a08", margin:"20px 0" }} />}
      </div>)}
      {tab==="conclusao"&&<><h3 style={{ color:G, fontSize:14, marginTop:0 }}>CONCLUSAO</h3>{para(sermon.conclusao)}</>}
      {tab==="apelo"&&<div style={{ background:"rgba(80,50,120,0.15)", border:"2px solid #7050a0", borderRadius:10, padding:20 }}><h3 style={{ color:G, fontSize:14, marginTop:0 }}>APELO</h3>{para(sermon.apelo)}</div>}
      {tab==="referencias"&&<><h3 style={{ color:G, fontSize:14, marginTop:0 }}>REFERENCIAS</h3>{(sermon.referencias||[]).map((r,i) => <div key={i} style={{ borderLeft:"3px solid #5a3f10", paddingLeft:12, marginBottom:10 }}><div style={{ fontSize:11, color:G, marginBottom:3, textTransform:"uppercase" }}>{r.tipo}</div><p style={{ margin:0, fontSize:14, color:"#e0d0a0" }}>{r.descricao}</p></div>)}</>}
      {tab==="lexico"&&sermon.lexico&&<><h3 style={{ color:G, fontSize:14, marginTop:0 }}>ANALISE LEXICA</h3>{(sermon.lexico.palavras||[]).map((p,i) => <div key={i} style={{ background:"rgba(60,40,10,0.5)", border:"1px solid #7a5a15", borderRadius:10, padding:16, marginBottom:12 }}><div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:8 }}><span style={{ fontSize:20, color:"#f0d080", fontStyle:"italic" }}>{p.original}</span><span style={{ fontSize:13, color:"#a08040" }}>({p.transliteracao})</span><span style={{ fontSize:12, background:p.idioma==="Grego"?"rgba(70,100,180,0.3)":"rgba(180,100,40,0.3)", border:"1px solid " + (p.idioma==="Grego"?"#6080c0":"#c07040"), padding:"2px 8px", borderRadius:10, color:p.idioma==="Grego"?"#a0c0ff":"#ffa060" }}>{p.idioma}</span><span style={{ fontSize:13, color:G, fontWeight:"bold" }}>{p.traducao}</span></div><p style={{ margin:0, fontSize:14, color:"#e0d0a0", lineHeight:1.8 }}>{p.significado}</p></div>)}</>}
      {tab==="dinamicas"&&<PainelDinamicas sermon={sermon} />}
      {tab==="avaliacao"&&<PainelAvaliacao sermon={sermon} onAplicarMelhorias={s => { setSermon(s); setActiveTab("introducao"); setSaveMsg("Melhorias aplicadas com sucesso!"); setTimeout(()=>setSaveMsg(""),3000); }} />}
      {tab==="historico"&&<><h3 style={{ color:G, fontSize:14, marginTop:0 }}>HISTORICO DE PREGACAO</h3>{(sermon.historico||[]).length===0?<p style={{ color:"#7a5a30", fontStyle:"italic" }}>Nenhuma pregacao registrada.</p>:(sermon.historico||[]).map((h,i) => <div key={i} style={{ background:"rgba(80,50,120,0.1)", border:"1px solid #6050a0", borderRadius:8, padding:12, marginBottom:8 }}><div style={{ fontSize:12, color:G, marginBottom:3 }}>{h.data}</div><div style={{ fontSize:14, color:"#f0e0b8" }}>{h.local}</div>{h.evento&&<div style={{ fontSize:12, color:"#a08040", fontStyle:"italic" }}>{h.evento}</div>}</div>)}</>}
    </div>
  );
}

export default function App() {
  const [mainView, setMainView] = useState("generate");
  const [ferrView, setFerrView] = useState("esboco");
  const [estudoView, setEstudoView] = useState("chat");
  const [passage, setPassage] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedVersao, setSelectedVersao] = useState("ARC");
  const [selectedEstilo, setSelectedEstilo] = useState("original");
  const [selectedPerfil, setSelectedPerfil] = useState("tradicional");
  const [selectedPublico, setSelectedPublico] = useState("familias");
  const [selectedDuracao, setSelectedDuracao] = useState("30min");
  const [sermon, setSermon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLexico, setLoadingLexico] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("introducao");
  const [library, setLibrary] = useState([]);
  const [editingSermon, setEditingSermon] = useState(null);
  const [saveMsg, setSaveMsg] = useState("");
  const [showHistorico, setShowHistorico] = useState(false);
  const [historicoTarget, setHistoricoTarget] = useState(null);
  const [showApres, setShowApres] = useState(false);
  const [apresSermon, setApresSermon] = useState(null);

  useEffect(() => { loadSermons().then(setLibrary); }, []);

  const generate = async () => {
    if (!passage.trim()) return;
    const typeObj = SERMON_TYPES.find(t => t.id===selectedType) || SERMON_TYPES[0];
    setLoading(true); setError(""); setSermon(null);
    try {
      const parsed = await callAPI(buildMainSys(selectedVersao, selectedEstilo, selectedPerfil, selectedPublico, selectedDuracao), TIPO_PROMPTS[typeObj.id] + "\n\nTexto/Tema: " + passage);
      parsed.id = Date.now(); parsed.savedAt = null; parsed.tipo = typeObj.label; parsed.estilo = selectedEstilo;
      parsed.perfil_igreja = (PERFIS_IGREJA.find(x => x.id===selectedPerfil)||{}).label || "";
      parsed.perfil_publico = (PERFIS_PUBLICO.find(x => x.id===selectedPublico)||{}).label || "";
      parsed.duracao = (DURACOES.find(x => x.id===selectedDuracao)||{}).label || "";
      parsed.pontos = Array.isArray(parsed.pontos) ? parsed.pontos : [];
      parsed.introducao = parsed.introducao || parsed["introducao"] || "";
      parsed.conclusao = parsed.conclusao || parsed["conclusao"] || "";
      parsed.apelo = parsed.apelo || "";
      parsed.tema = parsed.tema || parsed.proposicao || "";
      parsed.pericope = parsed.pericope || "";
      parsed.referencias = Array.isArray(parsed.referencias) ? parsed.referencias : [];
      parsed.versao_biblica = parsed.versao_biblica || selectedVersao;
      parsed.lexico = null; parsed.historico = [];
      setSermon(parsed); setActiveTab("introducao");
    } catch(e) { setError("Erro: " + e.message); }
    setLoading(false);
  };

  const generateLexico = async () => {
    if (!sermon||loadingLexico) return; setLoadingLexico(true);
    try { const r = await callAPI(LEXICO_SYS, "Texto: " + sermon.pericope + "\nTitulo: " + sermon.titulo + "\nTema: " + sermon.tema); setSermon(Object.assign({},sermon,{lexico:r})); }
    catch(e) { setError("Erro lexico: " + e.message); }
    setLoadingLexico(false);
  };

  const saveToLibrary = async s => {
    const d = Object.assign({},s,{savedAt:s.savedAt||new Date().toLocaleDateString("pt-BR")});
    const u = library.find(x => x.id===s.id) ? library.map(x => x.id===s.id?d:x) : [...library,d];
    setLibrary(u); await saveSermons(u); if (!s.savedAt) setSermon(d);
    setSaveMsg("Salvo!"); setTimeout(() => setSaveMsg(""), 2500);
  };
  const openEditor = s => { setEditingSermon(JSON.parse(JSON.stringify(s))); setMainView("editor"); };
  const saveEdit = async () => { const u=library.map(x => x.id===editingSermon.id?editingSermon:x); setLibrary(u); await saveSermons(u); setSaveMsg("Salvo!"); setTimeout(() => setSaveMsg(""), 2500); };
  const deleteSermon = async id => {
    const s = library.find(x => x.id===id);
    const titulo = s ? s.titulo : "este sermao";
    if (!window.confirm("Deseja excluir definitivamente o sermao: " + titulo + "?\n\nEsta acao nao pode ser desfeita.")) return;
    const u = library.filter(x => x.id!==id); setLibrary(u); await saveSermons(u);
    if (editingSermon && editingSermon.id===id) { setEditingSermon(null); setMainView("library"); }
  };
  const getHistSerm = () => { if (historicoTarget==="current") return sermon; if (editingSermon && editingSermon.id===historicoTarget) return editingSermon; return library.find(x => x.id===historicoTarget) || null; };
  const handleHistSave = async nh => {
    if (historicoTarget==="current") { setSermon(Object.assign({},sermon,{historico:nh})); }
    else { const u=library.map(x => x.id===historicoTarget?Object.assign({},x,{historico:nh}):x); setLibrary(u); await saveSermons(u); if (editingSermon && editingSermon.id===historicoTarget) setEditingSermon(Object.assign({},editingSermon,{historico:nh})); }
  };
  const copiarTexto = s => { const t=[s.titulo, s.pericope + " | " + (s.versao_biblica||""), "Tema: " + s.tema, "", ...(s.pontos||[]).map(pt => "- " + pt.titulo), "", "Pr. Fernando Veiga"].join("\n"); navigator.clipboard.writeText(t).catch(() => {}); setSaveMsg("Copiado!"); setTimeout(() => setSaveMsg(""), 2000); };

  const TABS_SERMON = sermon ? [["introducao","Introducao"],["pontos","Pontos"],["conclusao","Conclusao"],["apelo","Apelo"],["referencias","Refs"],["dinamicas","Dinamicas"],["avaliacao","Avaliar"],...(sermon.lexico?[["lexico","Lexico"]]:[]),...(sermon.historico&&sermon.historico.length?[["historico","Historico"]]:[])] : [];
  const NAV = [["generate","Gerar"],["ferramentas","Ferramentas"],["estudo","Estudo"],["refinador","Refinar"],["library","Biblioteca" + (library.length>0?" ("+library.length+")":"")]];

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#1a1207 0%,#2d1f0a 50%,#1a1207 100%)", fontFamily:"Georgia,serif", color:"#f5e6c8" }}>
      {showHistorico&&getHistSerm()&&<HistModal sermon={getHistSerm()} onSave={handleHistSave} onClose={() => setShowHistorico(false)} />}
      {showApres&&apresSermon&&<Apresentacao sermon={apresSermon} onClose={() => setShowApres(false)} />}

      <div style={{ background:"linear-gradient(180deg,#3d2a08,#2a1c05)", borderBottom:"2px solid " + G, padding:"16px 20px", textAlign:"center" }}>
        <div style={{ fontSize:22 }}>📖</div>
        <h1 style={{ margin:"3px 0 1px", fontSize:19, color:"#f0d080", letterSpacing:1 }}>Sermoes e Mensagens</h1>
        <p style={{ margin:"0 0 10px", fontSize:12, color:G, fontStyle:"italic" }}>Pr. Fernando Veiga</p>
        <div style={{ display:"flex", justifyContent:"center", gap:6, flexWrap:"wrap" }}>
          {NAV.map(([id,lbl]) => <button key={id} onClick={() => setMainView(id)} style={bS(mainView===id)}>{lbl}</button>)}
        </div>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"22px 16px" }}>
        {saveMsg&&<div style={{ background:"#2a4a2a", border:"1px solid #60a060", borderRadius:8, padding:"10px 16px", marginBottom:12, color:"#90e090", fontSize:14 }}>{saveMsg}</div>}

        {mainView==="generate"&&<>
          <div style={{ background:"rgba(60,40,10,0.7)", border:"1px solid " + G, borderRadius:12, padding:20, marginBottom:16 }}>

            <div style={{ fontSize:13, color:G, marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>Tipo de Sermao</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:6, marginBottom:18 }}>
              {SERMON_TYPES.map(t => <button key={t.id} onClick={() => setSelectedType(t.id)} style={{ padding:"9px 10px", borderRadius:8, border:"1px solid " + (selectedType===t.id?G:"#5a3f10"), background:selectedType===t.id?"rgba(201,162,39,0.15)":"transparent", color:selectedType===t.id?G:"#c0a060", fontSize:12, cursor:"pointer", fontFamily:"Georgia,serif", textAlign:"left" }}><div style={{ fontWeight:selectedType===t.id?"bold":"normal", marginBottom:2 }}>{t.label}</div><div style={{ fontSize:11, color:"#8a6a30" }}>{t.desc}</div></button>)}
            </div>

            <div style={{ fontSize:13, color:G, marginBottom:7, letterSpacing:1, textTransform:"uppercase" }}>Estilo</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:5 }}>{ESTILOS.map(e => <button key={e.id} onClick={() => setSelectedEstilo(e.id)} style={cS(selectedEstilo===e.id)}>{e.label}</button>)}</div>
            <p style={{ fontSize:12, color:"#8a6a30", marginBottom:16, fontStyle:"italic" }}>{(ESTILOS.find(e => e.id===selectedEstilo)||{}).desc}</p>

            <div style={{ fontSize:13, color:G, marginBottom:7, letterSpacing:1, textTransform:"uppercase" }}>Versao da Biblia</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:5 }}>{VERSOES.map(v => <button key={v.id} onClick={() => setSelectedVersao(v.id)} style={cS(selectedVersao===v.id)}>{v.id}</button>)}</div>
            <p style={{ fontSize:12, color:"#8a6a30", marginBottom:16, fontStyle:"italic" }}>{(VERSOES.find(v => v.id===selectedVersao)||{}).desc}</p>

            <div style={{ fontSize:13, color:G, marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>Duracao do Sermao</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:7, marginBottom:16 }}>
              {DURACOES.map(d => <button key={d.id} onClick={() => setSelectedDuracao(d.id)} style={{ padding:"10px 8px", borderRadius:8, border:"1px solid " + (selectedDuracao===d.id?G:"#5a3f10"), background:selectedDuracao===d.id?"rgba(201,162,39,0.15)":"transparent", color:selectedDuracao===d.id?G:"#c0a060", fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif", textAlign:"center" }}><div style={{ fontWeight:selectedDuracao===d.id?"bold":"normal", marginBottom:3 }}>{d.label}</div><div style={{ fontSize:11, color:"#8a6a30", lineHeight:1.3 }}>{d.desc}</div></button>)}
            </div>

            <div style={{ fontSize:13, color:G, marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>Perfil da Igreja</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))", gap:7, marginBottom:16 }}>
              {PERFIS_IGREJA.map(p => <button key={p.id} onClick={() => setSelectedPerfil(p.id)} style={{ padding:"10px 12px", borderRadius:8, border:"1px solid " + (selectedPerfil===p.id?G:"#5a3f10"), background:selectedPerfil===p.id?"rgba(201,162,39,0.15)":"transparent", color:selectedPerfil===p.id?G:"#c0a060", fontSize:13, cursor:"pointer", fontFamily:"Georgia,serif", textAlign:"left" }}><div style={{ fontWeight:selectedPerfil===p.id?"bold":"normal", marginBottom:2 }}>{p.label}</div><div style={{ fontSize:11, color:"#8a6a30", lineHeight:1.3 }}>{p.desc}</div></button>)}
            </div>

            <div style={{ fontSize:13, color:G, marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>Perfil do Publico</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
              {PERFIS_PUBLICO.map(p => <button key={p.id} onClick={() => setSelectedPublico(p.id)} style={cS(selectedPublico===p.id)}>{p.label}</button>)}
            </div>

            <div style={{ fontSize:13, color:G, marginBottom:7, letterSpacing:1, textTransform:"uppercase" }}>Passagem / Tema</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <input value={passage} onChange={e => setPassage(e.target.value)} onKeyDown={e => e.key==="Enter"&&generate()} placeholder="Ex: Romanos 8.1-11, Salmo 23, A Graca de Deus..." style={{ flex:1, minWidth:200, padding:"10px 14px", borderRadius:8, border:"1px solid #8a6a20", background:D, color:"#f5e6c8", fontSize:14, fontFamily:"Georgia,serif", outline:"none" }} />
              <button onClick={generate} disabled={loading||!passage.trim()} style={{ padding:"10px 22px", borderRadius:8, border:"none", background:loading?"#6b5010":"linear-gradient(135deg," + G + ",#a07820)", color:D, fontWeight:"bold", fontSize:15, cursor:loading?"not-allowed":"pointer", fontFamily:"Georgia,serif" }}>{loading?"Gerando...":"Gerar"}</button>
            </div>
            {error&&<p style={{ color:"#e07070", marginTop:8, fontSize:13 }}>{error}</p>}
          </div>

          {loading&&<div style={{ textAlign:"center", marginTop:28, color:G }}><div style={{ fontSize:26 }}>📖</div><p style={{ fontStyle:"italic", marginTop:8 }}>Elaborando o sermao...</p></div>}

          {sermon&&<>
            <div style={{ display:"flex", gap:6, justifyContent:"flex-end", marginBottom:10, flexWrap:"wrap" }}>
              <button onClick={() => saveToLibrary(sermon)} style={bS(false)}>Salvar</button>
              <button onClick={() => { setHistoricoTarget("current"); setShowHistorico(true); }} style={Object.assign({},bS(false),{borderColor:"#7050a0",color:"#b090e0"})}>Historico</button>
              <button onClick={() => { setApresSermon(sermon); setShowApres(true); }} style={Object.assign({},bS(false),{borderColor:"#40a060",color:"#80e0a0"})}>Apresentar</button>
              <button onClick={() => copiarTexto(sermon)} style={Object.assign({},bS(false),{borderColor:"#4080c0",color:"#80c0f0"})}>Copiar</button>
              <button onClick={() => exportPDF(sermon)} style={bS(false)}>PDF</button>
            </div>
            <div style={{ background:"linear-gradient(135deg,#3d2a08,#2a1c05)", border:"1px solid " + G, borderRadius:12, padding:20, marginBottom:12, textAlign:"center" }}>
              <div style={{ fontSize:11, color:"#a08040", letterSpacing:2, textTransform:"uppercase", marginBottom:3 }}>{sermon.tipo} - {sermon.pericope} - {sermon.duracao||""}</div>
              <h2 style={{ margin:"0 0 6px", fontSize:20, color:"#f0d080" }}>{sermon.titulo}</h2>
              <div style={{ height:1, background:G, margin:"10px auto", width:56 }} />
              <p style={{ margin:"0 0 3px", fontSize:13, fontStyle:"italic", color:"#d4b060" }}>{sermon.tema}</p>
              <p style={{ margin:"0 0 3px", fontSize:11, color:"#7a6030" }}>{sermon.versao_biblica}</p>
              {sermon.perfil_igreja&&<p style={{ margin:0, fontSize:11, color:"#6a5020" }}>{sermon.perfil_igreja} - {sermon.perfil_publico}</p>}
            </div>
            <div style={{ background:"rgba(30,20,5,0.6)", border:"1px solid #4a3508", borderRadius:10, padding:12, marginBottom:12 }}>
              <div style={{ fontSize:12, color:G, letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Enriquecimento</div>
              <button onClick={generateLexico} disabled={loadingLexico||!!sermon.lexico} style={Object.assign({},bS(!!sermon.lexico),{fontSize:12,padding:"6px 13px",cursor:loadingLexico?"wait":sermon.lexico?"default":"pointer"})}>{loadingLexico?"Analisando...":sermon.lexico?"Lexico Gerado":"Analise Lexica"}</button>
            </div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>{TABS_SERMON.map(([id,lbl]) => <button key={id} onClick={() => setActiveTab(id)} style={bS(activeTab===id)}>{lbl}</button>)}</div>
            <SermonContent sermon={sermon} tab={activeTab} />
          </>}
        </>}

        {mainView==="ferramentas"&&<>
          <h2 style={{ color:G, fontSize:15, letterSpacing:1, marginBottom:14 }}>Ferramentas de Preparacao</h2>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>
            <button onClick={() => setFerrView("esboco")}      style={bS(ferrView==="esboco")}>Esboco</button>
            <button onClick={() => setFerrView("ilustracoes")} style={bS(ferrView==="ilustracoes")}>Ilustracoes</button>
            <button onClick={() => setFerrView("calendario")}  style={bS(ferrView==="calendario")}>Cal. Tematico</button>
            <button onClick={() => setFerrView("temas")}       style={bS(ferrView==="temas")}>Banco de Temas</button>
            <button onClick={() => setFerrView("serie")}       style={bS(ferrView==="serie")}>Serie Expositiva</button>
          </div>
          <Card>
            {ferrView==="esboco"      && <PainelEsboco />}
            {ferrView==="ilustracoes" && <PainelIlustracoes />}
            {ferrView==="calendario"  && <PainelCalendario />}
            {ferrView==="temas"       && <PainelTemas onUsarTema={(titulo, texto) => { setPassage(texto + " - " + titulo); setMainView("generate"); setSaveMsg("Tema carregado! Configure e clique em Gerar."); setTimeout(() => setSaveMsg(""), 3500); }} />}
            {ferrView==="serie"       && <PainelSerie />}
          </Card>
        </>}

        {mainView==="estudo"&&<>
          <h2 style={{ color:G, fontSize:15, letterSpacing:1, marginBottom:14 }}>Recursos de Estudo</h2>
          <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>
            <button onClick={() => setEstudoView("chat")}       style={bS(estudoView==="chat")}>Chat com o Texto</button>
            <button onClick={() => setEstudoView("comparacao")} style={bS(estudoView==="comparacao")}>Comparacao de Versoes</button>
            <button onClick={() => setEstudoView("mapa")}       style={bS(estudoView==="mapa")}>Mapa do Contexto</button>
          </div>
          <Card>
            {estudoView==="chat"       && <PainelChat />}
            {estudoView==="comparacao" && <PainelComparacao />}
            {estudoView==="mapa"       && <PainelMapa />}
          </Card>
        </>}

        {mainView==="refinador"&&<>
          <h2 style={{ color:G, fontSize:15, letterSpacing:1, marginBottom:14 }}>Refinar Sermao</h2>
          <Card><PainelRefinador onSaveLibrary={async(s) => { const updated=[s,...library]; setLibrary(updated); await saveSermons(updated); }} /></Card>
        </>}

        {mainView==="library"&&<>
          <h2 style={{ color:G, fontSize:15, letterSpacing:1, marginBottom:14 }}>Biblioteca de Sermoes</h2>
          {library.length===0?<div style={{ textAlign:"center", padding:48, color:"#7a5a30", fontStyle:"italic" }}>Nenhum sermao salvo ainda.</div>
            :[...library].sort((a,b) => (b.id||0)-(a.id||0)).map(s => <div key={s.id} style={{ background:"rgba(40,25,5,0.8)", border:"1px solid #5a3f10", borderRadius:10, padding:14, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
              <div>
                <div style={{ fontSize:11, color:G, letterSpacing:1, marginBottom:3 }}>{s.tipo||"Sermao"} - {s.pericope} - {s.savedAt}</div>
                <div style={{ fontSize:15, color:"#f0d080", marginBottom:3 }}>{s.titulo}</div>
                <div style={{ fontSize:12, fontStyle:"italic", color:"#a08040" }}>{(s.tema||"").slice(0,65)}...</div>
              </div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                <button onClick={() => openEditor(s)} style={Object.assign({},bS(false),{fontSize:12,padding:"5px 11px"})}>Editar</button>
                <button onClick={() => { setHistoricoTarget(s.id); setShowHistorico(true); }} style={Object.assign({},bS(false),{fontSize:12,padding:"5px 11px",borderColor:"#7050a0",color:"#b090e0"})}>Historico</button>
                <button onClick={() => { setApresSermon(s); setShowApres(true); }} style={Object.assign({},bS(false),{fontSize:12,padding:"5px 11px",borderColor:"#40a060",color:"#80e0a0"})}>Apresentar</button>
                <button onClick={() => copiarTexto(s)} style={Object.assign({},bS(false),{fontSize:12,padding:"5px 11px",borderColor:"#4080c0",color:"#80c0f0"})}>Copiar</button>
                <button onClick={() => exportPDF(s)} style={Object.assign({},bS(false),{fontSize:12,padding:"5px 11px"})}>PDF</button>
                <button onClick={() => deleteSermon(s.id)} style={Object.assign({},bS(false),{fontSize:12,padding:"5px 11px",borderColor:"#8a3030",color:"#e08080"})}>Excluir</button>
              </div>
            </div>)}
        </>}

        {mainView==="editor"&&editingSermon&&<>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
            <h2 style={{ color:G, fontSize:15, letterSpacing:1, margin:0 }}>Editar Sermao</h2>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              <button onClick={saveEdit} style={Object.assign({},bS(true),{background:"linear-gradient(135deg," + G + ",#a07820)",color:D})}>Salvar</button>
              <button onClick={() => { setHistoricoTarget(editingSermon.id); setShowHistorico(true); }} style={Object.assign({},bS(false),{borderColor:"#7050a0",color:"#b090e0"})}>Historico</button>
              <button onClick={() => exportPDF(editingSermon)} style={bS(false)}>PDF</button>
              <button onClick={() => setMainView("library")} style={Object.assign({},bS(false),{borderColor:"#555",color:"#aaa"})}>Voltar</button>
            </div>
          </div>
          <Ef label="Pericope"><ET value={editingSermon.pericope} onChange={v => setEditingSermon(Object.assign({},editingSermon,{pericope:v}))}/></Ef>
          <Ef label="Titulo"><ET value={editingSermon.titulo} onChange={v => setEditingSermon(Object.assign({},editingSermon,{titulo:v}))} style={{ fontSize:16 }}/></Ef>
          <Ef label="Tema"><ET value={editingSermon.tema} onChange={v => setEditingSermon(Object.assign({},editingSermon,{tema:v}))} multiline/></Ef>
          <Ef label="Versao Biblica"><ET value={editingSermon.versao_biblica||""} onChange={v => setEditingSermon(Object.assign({},editingSermon,{versao_biblica:v}))}/></Ef>
          <Ef label="Introducao"><ET value={editingSermon.introducao} onChange={v => setEditingSermon(Object.assign({},editingSermon,{introducao:v}))} multiline style={{ minHeight:120 }}/></Ef>
          {(editingSermon.pontos||[]).map((pt,i) => <div key={i} style={{ background:"rgba(40,25,5,0.6)", border:"1px solid #4a3508", borderRadius:10, padding:14, marginBottom:10 }}>
            <div style={{ color:G, fontSize:12, letterSpacing:1, marginBottom:10 }}>PONTO {rn(pt.numero)}</div>
            <Ef label="Titulo"><ET value={pt.titulo} onChange={v => { const p=[...editingSermon.pontos]; p[i]=Object.assign({},p[i],{titulo:v}); setEditingSermon(Object.assign({},editingSermon,{pontos:p})); }}/></Ef>
            <Ef label="Exposicao"><ET value={pt.exposicao} onChange={v => { const p=[...editingSermon.pontos]; p[i]=Object.assign({},p[i],{exposicao:v}); setEditingSermon(Object.assign({},editingSermon,{pontos:p})); }} multiline style={{ minHeight:110 }}/></Ef>
            <Ef label="Aplicacao"><ET value={pt.aplicacao} onChange={v => { const p=[...editingSermon.pontos]; p[i]=Object.assign({},p[i],{aplicacao:v}); setEditingSermon(Object.assign({},editingSermon,{pontos:p})); }} multiline/></Ef>
          </div>)}
          <Ef label="Conclusao"><ET value={editingSermon.conclusao} onChange={v => setEditingSermon(Object.assign({},editingSermon,{conclusao:v}))} multiline style={{ minHeight:100 }}/></Ef>
          <Ef label="Apelo"><ET value={editingSermon.apelo} onChange={v => setEditingSermon(Object.assign({},editingSermon,{apelo:v}))} multiline style={{ minHeight:100 }}/></Ef>
          <div style={{ textAlign:"center", marginTop:18 }}>
            <button onClick={saveEdit} style={{ padding:"11px 28px", borderRadius:8, border:"none", background:"linear-gradient(135deg," + G + ",#a07820)", color:D, fontWeight:"bold", fontSize:15, cursor:"pointer", fontFamily:"Georgia,serif" }}>Salvar Alteracoes</button>
          </div>
        </>}
      </div>
    </div>
  );
}
