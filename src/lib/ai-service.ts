
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

// Default / fallback AI settings
const DEFAULT_AI_SETTINGS: AISettings = {
  provider: "google",
  model: "gemini-2.5-flash",
  apiKey: "",
};

/**
 * Fetches the global AI settings from the first coaching record that has a configured API key.
 * This ensures ALL accounts share the same AI configuration set by the admin in the database.
 */
export async function getGlobalAISettings(): Promise<AISettings> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase
      .from("coaching")
      .select("ai_settings")
      .not("ai_settings", "is", null)
      .limit(1)
      .maybeSingle();

    if (error || !data?.ai_settings) {
      console.warn("Could not fetch global AI settings, using defaults.");
      return DEFAULT_AI_SETTINGS;
    }

    const ai = data.ai_settings as Record<string, string>;
    return {
      provider: (ai.provider as AIProvider) || DEFAULT_AI_SETTINGS.provider,
      model: ai.model || DEFAULT_AI_SETTINGS.model,
      apiKey: ai.apiKey || DEFAULT_AI_SETTINGS.apiKey,
    };
  } catch (err) {
    console.error("Error fetching global AI settings:", err);
    return DEFAULT_AI_SETTINGS;
  }
}

export async function generateText({ settings, prompt, systemPrompt }: AIGenerateParams): Promise<string> {
  const { provider, model, apiKey } = settings;
  const cleanApiKey = apiKey.trim();
  if (!cleanApiKey) throw new Error("API Key is missing in AI settings. Please ask the admin to configure it in the database.");

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


export async function fetchModels(provider: AIProvider, apiKey: string): Promise<{ id: string, name: string }[]> {
  const cleanApiKey = apiKey.trim();
  if (!cleanApiKey) throw new Error("API Key is missing.");

  if (provider === "openai") {
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${cleanApiKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to fetch OpenAI models.");
    }

    const data = await response.json();
    return data.data
      .filter((m: any) => m.id.startsWith("gpt-"))
      .map((m: any) => ({
        id: m.id,
        name: m.id.toUpperCase(),
      }))
      .sort((a: any, b: any) => a.id.localeCompare(b.id));
  }

  if (provider === "google") {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanApiKey}`, {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to fetch Google models.");
    }

    const data = await response.json();
    return data.models
      .filter((m: any) => m.supportedGenerationMethods.includes("generateContent"))
      .map((m: any) => ({
        id: m.name.split("/").pop(),
        name: m.displayName || m.name.split("/").pop(),
      }));
  }

  throw new Error("Unsupported AI Provider.");
}

export const AI_MODELS = {
  openai: [
    { id: "gpt-4o", name: "GPT-4o (Most Capable)" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini (Fast & Efficient)" },
  ],
  google: [
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (Most Capable)" },
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash (Fast & Efficient)" },
    { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite (Ultra Fast)" },
  ],
};
