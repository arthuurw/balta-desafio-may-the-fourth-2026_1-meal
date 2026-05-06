import type { RecipeSuggestionRequest, RecipeSuggestionResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const TIMEOUT_MS = 60_000;

interface ProblemDetails {
  title?: string;
  errors?: Record<string, string[]>;
}

function extractError(status: number, body: string): string {
  if (status === 400) {
    try {
      const p = JSON.parse(body) as ProblemDetails;
      if (p.errors) return Object.values(p.errors).flat().join(" ");
      if (p.title) return p.title;
    } catch { /* not json */ }
    return body || "Requisição inválida.";
  }
  if (status === 500) return "Falha na comunicação com o agente. Tente novamente.";
  return body || `Erro ${status}`;
}

export async function suggestRecipes(req: RecipeSuggestionRequest): Promise<RecipeSuggestionResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_URL}/api/suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
      signal: controller.signal,
    });
    const body = await res.text();
    if (!res.ok) throw new Error(extractError(res.status, body));
    return JSON.parse(body) as RecipeSuggestionResponse;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError")
      throw new Error("Tempo de resposta excedido (60s). Tente novamente.");
    if (err instanceof TypeError)
      throw new Error("Não foi possível conectar à API. Verifique se o servidor está rodando.");
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
