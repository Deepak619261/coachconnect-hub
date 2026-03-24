
export type AIProvider = "openai" | "google";

export interface AISettings {
  provider: AIProvider;
  model: string;
  apiKey: string;
}

export interface AIGenerateParams {
  settings: AISettings;
  prompt: string;
  systemPrompt?: string;
}

export async function generateText({ settings, prompt, systemPrompt }: AIGenerateParams): Promise<string> {
  const { provider, model, apiKey } = settings;
  const cleanApiKey = apiKey.trim();
  if (!cleanApiKey) throw new Error("API Key is missing in AI settings.");

  if (provider === "openai") {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cleanApiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to generate text from OpenAI.");
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  } 
  
  if (provider === "google") {
    // Google Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemPrompt ? `${systemPrompt}\n\n` : ""}${prompt}` }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to generate text from Google Gemini.");
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || "";
  }

  throw new Error("Unsupported AI Provider selected.");
}

export const AI_MODELS = {
  openai: [
    { id: "gpt-4o", name: "GPT-4o (Most Capable)" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini (Fast & Efficient)" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  ],
  google: [
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Most Capable)" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (Fast & Efficient)" },
  ],
};
