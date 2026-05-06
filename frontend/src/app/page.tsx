"use client";

import { useState } from "react";
import type { Ingredient, Recipe } from "@/types";
import { suggestRecipes } from "@/services/api";
import { IngredientsForm } from "@/components/IngredientsForm";
import { CookingTimeForm } from "@/components/CookingTimeForm";
import { RecipeResults } from "@/components/RecipeResults";

export default function Page() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [availableTimeMinutes, setAvailableTimeMinutes] = useState(30);
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = ingredients.length > 0 && ingredients.every((i) => i.name.trim()) && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRecipes(null);
    setLoading(true);
    try {
      const result = await suggestRecipes({ ingredients, availableTimeMinutes });
      setRecipes(result.recipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100svh", padding: "0 20px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", paddingTop: 72, paddingBottom: 96 }}>

        {/* Badge */}
        <div style={{ marginBottom: 28 }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(124,58,237,0.12)",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: 999,
            padding: "6px 14px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#a78bfa",
            fontFamily: "var(--font-space)",
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#7c3aed",
              animation: "pulse-glow 2s ease-in-out infinite",
            }} />
            May The Fourth 2026
          </span>
        </div>

        {/* Header */}
        <header style={{ marginBottom: 56 }}>
          <h1 className="gradient-text" style={{
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: 16,
            fontFamily: "var(--font-space)",
          }}>
            Chef Alexandre
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-2)", lineHeight: 1.6, maxWidth: 440 }}>
            Informe seus ingredientes e tempo disponível. O agente sugere até 3 receitas viáveis.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="glass" style={{ borderRadius: 20, padding: 24 }}>
            <IngredientsForm ingredients={ingredients} onChange={setIngredients} />
          </div>

          <div className="glass" style={{ borderRadius: 20, padding: 24 }}>
            <CookingTimeForm value={availableTimeMinutes} onChange={setAvailableTimeMinutes} />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "14px 24px",
              borderRadius: 14,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.04em",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              cursor: canSubmit ? "pointer" : "not-allowed",
              fontFamily: "var(--font-space)",
              marginTop: 4,
            }}
          >
            {loading && (
              <span style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.25)",
                borderTopColor: "white",
                animation: "spin 0.7s linear infinite",
                display: "block",
              }} />
            )}
            {loading ? "Consultando o agente…" : "Sugerir receitas"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 16,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 16,
            padding: "16px 20px",
            animation: "fadeUp 0.2s ease",
          }}>
            <p style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#f87171",
              marginBottom: 6,
              fontFamily: "var(--font-space)",
            }}>Erro</p>
            <p style={{ fontSize: 13, color: "rgba(252,165,165,0.8)", lineHeight: 1.5 }}>{error}</p>
          </div>
        )}

        {/* Results */}
        {recipes !== null && (
          <div style={{ marginTop: 48, animation: "fadeUp 0.3s ease" }}>
            <RecipeResults recipes={recipes} />
          </div>
        )}

        {/* Footer */}
        {recipes === null && !error && !loading && (
          <p style={{
            textAlign: "center",
            fontSize: 11,
            color: "var(--text-3)",
            marginTop: 80,
            letterSpacing: "0.05em",
          }}>
            Microsoft Agent Framework · Groq · llama-3.3-70b-versatile
          </p>
        )}
      </div>
    </main>
  );
}
