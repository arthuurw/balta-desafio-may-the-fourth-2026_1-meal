"use client";
import type { Ingredient } from "@/types";

const UNITS = ["unidade", "g", "kg", "ml", "L", "xícara", "colher", "dente", "fatia"];
const empty = (): Ingredient => ({ name: "", quantity: 1, unit: "unidade" });

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  color: "white",
  fontSize: 13,
  padding: "9px 12px",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  width: "100%",
};

function Field({ style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...style }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)";
        e.currentTarget.style.boxShadow = "0 0 0 2px rgba(124,58,237,0.15)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    />
  );
}

export function IngredientsForm({
  ingredients,
  onChange,
}: {
  ingredients: Ingredient[];
  onChange: (v: Ingredient[]) => void;
}) {
  const update = (i: number, key: keyof Ingredient, val: string | number) =>
    onChange(ingredients.map((ing, j) => (j === i ? { ...ing, [key]: val } : ing)));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#a78bfa",
            marginBottom: 2,
            fontFamily: "var(--font-space)",
          }}>
            Ingredientes
          </p>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>
            {ingredients.length === 0
              ? "Adicione ao menos um"
              : `${ingredients.length} adicionado${ingredients.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange([...ingredients, empty()])}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            color: "#a78bfa",
            background: "rgba(124,58,237,0.12)",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: 8,
            padding: "7px 14px",
            cursor: "pointer",
            transition: "all 0.15s",
            fontFamily: "var(--font-space)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(124,58,237,0.2)";
            e.currentTarget.style.borderColor = "rgba(124,58,237,0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(124,58,237,0.12)";
            e.currentTarget.style.borderColor = "rgba(124,58,237,0.25)";
          }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Adicionar
        </button>
      </div>

      {/* Empty state */}
      {ingredients.length === 0 && (
        <div style={{
          border: "1px dashed rgba(124,58,237,0.2)",
          borderRadius: 12,
          padding: "32px 0",
          textAlign: "center",
          background: "rgba(124,58,237,0.03)",
        }}>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>Nenhum ingrediente ainda.</p>
        </div>
      )}

      {/* Column labels */}
      {ingredients.length > 0 && (
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ flex: 1, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", fontFamily: "var(--font-space)" }}>Ingrediente</span>
          <span style={{ width: 60, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", textAlign: "center", fontFamily: "var(--font-space)" }}>Qtd</span>
          <span style={{ width: 100, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", fontFamily: "var(--font-space)" }}>Unidade</span>
          <span style={{ width: 32 }} />
        </div>
      )}

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ingredients.map((ing, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Field
              type="text"
              placeholder="frango, arroz, ovo…"
              value={ing.name}
              onChange={(e) => update(i, "name", e.target.value)}
              style={{ flex: 1 }}
            />
            <Field
              type="number"
              min={0}
              step="any"
              value={ing.quantity}
              onChange={(e) => update(i, "quantity", parseFloat(e.target.value) || 0)}
              style={{ width: 60, textAlign: "center" }}
            />
            <select
              value={ing.unit}
              onChange={(e) => update(i, "unit", e.target.value)}
              style={{
                ...inputStyle,
                width: 100,
                cursor: "pointer",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
                paddingRight: 28,
              }}
            >
              {UNITS.map((u) => (
                <option key={u} value={u} style={{ background: "#0d0b1a" }}>{u}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onChange(ingredients.filter((_, j) => j !== i))}
              aria-label="Remover"
              style={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                border: "none",
                background: "transparent",
                color: "var(--text-3)",
                fontSize: 18,
                cursor: "pointer",
                transition: "all 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#f87171";
                e.currentTarget.style.background = "rgba(239,68,68,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-3)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
