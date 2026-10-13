function extractJson(text) {
  let t = String(text).trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  const start = t.search(/[\[{]/);
  const end = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
  if (start === -1 || end <= start) return null;
  t = t.slice(start, end + 1);
  try {
    JSON.parse(t);
    return t;
  } catch (e) {
    const fixed = t.replace(/,\s*([}\]])/g, "$1");
    try {
      JSON.parse(fixed);
      return fixed;
    } catch (e2) {
      return null;
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Metodo nao permitido" } });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: { message: "GEMINI_API_KEY nao configurada no servidor." } });
    return;
  }

  try {
    const { system, messages, max_tokens } = req.body || {};

    const contents = (messages || []).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: typeof m.content === "string" ? m.content : JSON.stringify(m.content) }],
    }));

    const promptText = (system || "") + " " + contents.map((c) => c.parts[0].text).join(" ");
    const wantsJson = /json/i.test(promptText);

    const generationConfig = { maxOutputTokens: max_tokens || 8000 };
    if (wantsJson) {
      generationConfig.responseMimeType = "application/json";
    }

    const geminiBody = { contents, generationConfig };
    if (system) {
      geminiBody.systemInstruction = { parts: [{ text: system }] };
    }

    const model = "gemini-3.5-flash-lite";
    const url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent";

    const maxAttempts = wantsJson ? 2 : 1;
    let truncated = false;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify(geminiBody),
      });

      const data = await response.json();

      if (!response.ok) {
        res.status(response.status).json({ error: { message: (data.error && data.error.message) || "Erro na API do Gemini" } });
        return;
      }

      const candidate = data.candidates && data.candidates[0];
      const parts = (candidate && candidate.content && candidate.content.parts) || [];
      const text = parts.map((p) => p.text || "").join("");
      const finishReason = candidate && candidate.finishReason;

      if (!text) {
        res.status(500).json({ error: { message: "O Gemini nao retornou texto. Motivo: " + (finishReason || "desconhecido") } });
        return;
      }

      if (!wantsJson) {
        res.status(200).json({ content: [{ type: "text", text: text }] });
        return;
      }

      if (finishReason === "MAX_TOKENS") {
        truncated = true;
        break;
      }

      const cleaned = extractJson(text);
      if (cleaned !== null) {
        res.status(200).json({ content: [{ type: "text", text: cleaned }] });
        return;
      }
    }

    res.status(500).json({
      error: {
        message: truncated
          ? "A resposta foi cortada por limite de tamanho. Tente refinar uma parte menor do sermao."
          : "A IA devolveu uma resposta em formato invalido. Tente novamente.",
      },
    });
  } catch (e) {
    res.status(500).json({ error: { message: "Falha ao chamar a API do Gemini: " + e.message } });
  }
}
