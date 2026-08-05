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

    const geminiBody = {
      contents,
      generationConfig: { maxOutputTokens: max_tokens || 8000 },
    };
    if (system) {
      geminiBody.systemInstruction = { parts: [{ text: system }] };
    }

    const model = "gemini-2.5-flash";
    const url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    if (!text) {
      res.status(500).json({ error: { message: "O Gemini nao retornou texto. Motivo: " + ((candidate && candidate.finishReason) || "desconhecido") } });
      return;
    }

    res.status(200).json({ content: [{ type: "text", text: text }] });
  } catch (e) {
    res.status(500).json({ error: { message: "Falha ao chamar a API do Gemini: " + e.message } });
  }
}
