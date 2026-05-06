"use client";

const PRESETS = [15, 30, 45, 60, 90];

export function CookingTimeForm({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <p style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#a78bfa",
          marginBottom: 4,
          fontFamily: "var(--font-space)",
        }}>
          Tempo disponível
        </p>
        <p style={{ fontSize: 13, color: "var(--text-3)" }}>Quanto tempo você tem para cozinhar?</p>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <input
            type="number"
            min={1}
            max={480}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10) || 1)}
            style={{
              width: 80,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: 14,
              color: "white",
              textAlign: "center",
              fontSize: 28,
              fontWeight: 800,
              padding: "12px 0",
              outline: "none",
              fontFamily: "var(--font-space)",
              boxShadow: "0 0 0 0 rgba(124,58,237,0)",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.18)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
              e.currentTarget.style.boxShadow = "0 0 0 0 rgba(124,58,237,0)";
            }}
          />
          <span style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.05em" }}>min</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingBottom: 20 }}>
          {PRESETS.map((p) => {
            const active = value === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onChange(p)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  border: active ? "1px solid rgba(124,58,237,0.7)" : "1px solid rgba(255,255,255,0.08)",
                  background: active ? "rgba(124,58,237,0.2)" : "transparent",
                  color: active ? "#c4b5fd" : "var(--text-3)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "var(--font-space)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
                    e.currentTarget.style.color = "#a78bfa";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "var(--text-3)";
                  }
                }}
              >
                {p} min
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
