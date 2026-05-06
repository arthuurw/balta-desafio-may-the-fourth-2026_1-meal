import type { Recipe } from "@/types";

const DIFF: Record<string, { label: string; color: string; bg: string; border: string }> = {
  "fácil":   { label: "Fácil",   color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)" },
  "médio":   { label: "Médio",   color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)" },
  "difícil": { label: "Difícil", color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
};

function RecipeCard({ recipe, index }: { recipe: Recipe; index: number }) {
  const diff = DIFF[recipe.difficulty] ?? DIFF["fácil"];

  return (
    <article style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 20,
      overflow: "hidden",
      backdropFilter: "blur(12px)",
    }}>
      {/* Accent strip */}
      <div style={{
        height: 2,
        background: "linear-gradient(90deg, #7c3aed, #4f46e5, transparent)",
        opacity: 0.7,
      }} />

      {/* Card header */}
      <div style={{ padding: "20px 24px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--text-3)",
            fontFamily: "var(--font-space)",
          }}>
            Receita {index + 1}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: 999,
              border: `1px solid ${diff.border}`,
              background: diff.bg,
              color: diff.color,
              fontFamily: "var(--font-space)",
            }}>
              {diff.label}
            </span>
            <span style={{
              fontSize: 12,
              color: "var(--text-2)",
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
            }}>
              {recipe.estimatedTimeMinutes} min
            </span>
          </div>
        </div>
        <h2 style={{
          fontSize: 20,
          fontWeight: 700,
          color: "white",
          lineHeight: 1.25,
          marginBottom: 8,
          fontFamily: "var(--font-space)",
        }}>
          {recipe.name}
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>{recipe.description}</p>
      </div>

      {/* Steps */}
      <div style={{ padding: "20px 24px" }}>
        <p style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#a78bfa",
          marginBottom: 16,
          fontFamily: "var(--font-space)",
        }}>
          Modo de preparo
        </p>
        <ol style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recipe.steps.map((step, j) => (
            <li key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{
                flexShrink: 0,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(124,58,237,0.3)",
                color: "#a78bfa",
                fontSize: 10,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2,
                fontFamily: "var(--font-space)",
              }}>
                {j + 1}
              </span>
              <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Missing ingredients */}
      {recipe.missingIngredients.length > 0 && (
        <div style={{ padding: "0 24px 24px" }}>
          <div style={{
            background: "rgba(251,191,36,0.06)",
            border: "1px solid rgba(251,191,36,0.2)",
            borderRadius: 14,
            padding: "14px 16px",
          }}>
            <p style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#fbbf24",
              marginBottom: 10,
              fontFamily: "var(--font-space)",
            }}>
              Ingredientes faltando
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {recipe.missingIngredients.map((item, k) => (
                <span key={k} style={{
                  fontSize: 12,
                  color: "rgba(253,230,138,0.8)",
                  background: "rgba(251,191,36,0.1)",
                  border: "1px solid rgba(251,191,36,0.2)",
                  borderRadius: 8,
                  padding: "4px 10px",
                }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export function RecipeResults({ recipes }: { recipes: Recipe[] }) {
  if (recipes.length === 0) {
    return (
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        padding: "48px 24px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🍽️</div>
        <p style={{ fontWeight: 700, color: "white", marginBottom: 8, fontFamily: "var(--font-space)" }}>
          Nenhuma receita encontrada
        </p>
        <p style={{ fontSize: 13, color: "var(--text-3)" }}>
          Tente mais ingredientes ou aumente o tempo disponível.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--text-3)",
        marginBottom: 4,
        fontFamily: "var(--font-space)",
      }}>
        {recipes.length} receita{recipes.length > 1 ? "s" : ""} sugerida{recipes.length > 1 ? "s" : ""}
      </p>
      {recipes.map((r, i) => (
        <RecipeCard key={i} recipe={r} index={i} />
      ))}
    </div>
  );
}
