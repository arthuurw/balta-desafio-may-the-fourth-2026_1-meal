# Frontend — meal-suggestions

Next.js 15 + TypeScript + Tailwind CSS.

## Estrutura

```
src/
├── app/
│   ├── layout.tsx   ← fontes (Inter + Space Grotesk via next/font), metadata
│   ├── page.tsx     ← página principal (Client Component, orquestra estado e submit)
│   └── globals.css  ← @import "tailwindcss", CSS vars, glassmorphism, gradiente, animações
├── components/
│   ├── IngredientsForm.tsx  ← lista dinâmica de ingredientes (add/remove), inline styles
│   ├── CookingTimeForm.tsx  ← input numérico + presets, inline styles
│   └── RecipeResults.tsx   ← cards de receitas com glassmorphism e accent strip
├── services/
│   └── api.ts       ← fetch POST com timeout 60s, parse de ProblemDetails 400 e TypeError
├── types/
│   └── index.ts     ← Ingredient, RecipeSuggestionRequest, Recipe, RecipeSuggestionResponse
└── __tests__/
    └── api.test.ts  ← 11 testes Vitest: happy path, 400/500/502, rede, timeout

vitest.config.ts     ← ambiente Node para testes unitários
```

## Como rodar

```bash
npm install
npm run dev
# App em http://localhost:3000 (ou 3001 se 3000 estiver ocupada)
```

## Como testar

```bash
npm test
# ou modo watch:
npm run test:watch
```

## Configuração

Criar `.env.local` (gitignored):

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
