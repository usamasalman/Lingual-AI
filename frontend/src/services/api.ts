const BASE_URL = "/api";

export interface Language {
  code: string;
  name: string;
  speechCode?: string;
}

export interface TranslateRequest {
  text: string;
  source: string;
  target: string;
}

export interface TranslateResponse {
  translatedText?: string;
  error?: string;
}

export async function getLanguages(): Promise<Language[]> {
  const res = await fetch(`${BASE_URL}/languages`);
  if (!res.ok) throw new Error("Failed to load languages.");
  return res.json();
}

export async function translateText(
  payload: TranslateRequest
): Promise<TranslateResponse> {
  const res = await fetch(`${BASE_URL}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
