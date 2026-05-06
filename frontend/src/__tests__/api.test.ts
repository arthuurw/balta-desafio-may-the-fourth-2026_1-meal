import { describe, it, expect, vi, beforeEach } from "vitest";
import { suggestRecipes } from "../services/api";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function makeResponse(status: number, body: string) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body),
  };
}

const validRequest = {
  ingredients: [{ name: "ovo", quantity: 4, unit: "unidade" }],
  availableTimeMinutes: 30,
};

describe("suggestRecipes", () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Happy path ────────────────────────────────────────────────────────────

  it("returns parsed recipes on 200", async () => {
    const payload = {
      recipes: [{
        name: "Omelete",
        description: "Rápido.",
        estimatedTimeMinutes: 10,
        difficulty: "fácil",
        steps: ["Bata os ovos.", "Cozinhe."],
        missingIngredients: [],
      }],
    };
    mockFetch.mockResolvedValueOnce(makeResponse(200, JSON.stringify(payload)));

    const result = await suggestRecipes(validRequest);

    expect(result.recipes).toHaveLength(1);
    expect(result.recipes[0].name).toBe("Omelete");
    expect(result.recipes[0].missingIngredients).toHaveLength(0);
  });

  it("sends POST to /api/suggestions with correct headers and body", async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(200, JSON.stringify({ recipes: [] })));

    await suggestRecipes(validRequest);

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/suggestions"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validRequest),
      })
    );
  });

  it("returns empty recipes array on 200 with empty list", async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(200, JSON.stringify({ recipes: [] })));

    const result = await suggestRecipes(validRequest);

    expect(result.recipes).toHaveLength(0);
  });

  // ── 400 ProblemDetails parsing ────────────────────────────────────────────

  it("throws joined validation errors on 400 with ProblemDetails.errors", async () => {
    const problem = {
      errors: { ingredients: ["Informe ao menos um ingrediente."] },
    };
    mockFetch.mockResolvedValueOnce(makeResponse(400, JSON.stringify(problem)));

    await expect(suggestRecipes(validRequest)).rejects.toThrow(
      "Informe ao menos um ingrediente."
    );
  });

  it("throws title on 400 with ProblemDetails.title only", async () => {
    const problem = { title: "One or more validation errors occurred." };
    mockFetch.mockResolvedValueOnce(makeResponse(400, JSON.stringify(problem)));

    await expect(suggestRecipes(validRequest)).rejects.toThrow(
      "One or more validation errors occurred."
    );
  });

  it("throws body text on 400 with non-JSON body", async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(400, "Bad Request"));

    await expect(suggestRecipes(validRequest)).rejects.toThrow("Bad Request");
  });

  // ── Provider/server errors ────────────────────────────────────────────────

  it("throws hardcoded message on 500", async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(500, "Internal Server Error"));

    await expect(suggestRecipes(validRequest)).rejects.toThrow(
      "Falha na comunicação com o agente. Tente novamente."
    );
  });

  it("throws body text on 502", async () => {
    mockFetch.mockResolvedValueOnce(makeResponse(502, "Bad Gateway"));

    await expect(suggestRecipes(validRequest)).rejects.toThrow("Bad Gateway");
  });

  // ── Network and timeout errors ────────────────────────────────────────────

  it("throws friendly message on TypeError (network unreachable)", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(suggestRecipes(validRequest)).rejects.toThrow(
      "Não foi possível conectar à API. Verifique se o servidor está rodando."
    );
  });

  it("throws timeout message on AbortError", async () => {
    mockFetch.mockRejectedValueOnce(new DOMException("Aborted", "AbortError"));

    await expect(suggestRecipes(validRequest)).rejects.toThrow(
      "Tempo de resposta excedido (60s). Tente novamente."
    );
  });

  it("rethrows unknown errors unchanged", async () => {
    const original = new Error("unexpected");
    mockFetch.mockRejectedValueOnce(original);

    await expect(suggestRecipes(validRequest)).rejects.toThrow("unexpected");
  });
});
