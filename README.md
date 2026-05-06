<img width="1280" height="630" alt="banner" src="https://github.com/user-attachments/assets/eb2f345f-7b28-41d0-b374-6336dc8f8f75" />

## 🚀 May The Fourth 2026 - Desafio 1

Oi, eu sou o Arthur Webster Moreira e este é o espaço onde compartilho minha jornada de aprendizado durante o desafio **May The Fourth 2026**, realizado pelo [balta.io](https://balta.io). 👻

Aqui você vai encontrar projetos, exercícios e códigos que estou desenvolvendo durante o desafio.

### Sobre este desafio
Informar ingredientes disponíveis e tempo para cozinhar. Um agente de IA cruza essas informações e sugere até 3 receitas viáveis.

**Nível implementado: Nível 2 — API + Fullstack**

#### Stack
- **Backend:** .NET 10 Minimal API — Vertical Slice, sem Clean Architecture
- **Agente:** Microsoft Agent Framework (`Microsoft.Agents.AI.OpenAI --prerelease`)
- **LLM:** Groq API (OpenAI-compatible) — modelo `llama-3.3-70b-versatile`
- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS

#### Como rodar

**Backend**
```bash
cd backend/MealSuggestions.Api
dotnet run
# API em http://localhost:5000
# Swagger em http://localhost:5000/swagger/index.html
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
# App em http://localhost:3000
```

> Configure `backend/MealSuggestions.Api/appsettings.Development.json` com sua chave Groq antes de rodar o backend.

#### Endpoint

```
POST /api/suggestions
Content-Type: application/json

{
  "ingredients": [
    { "name": "ovo", "quantity": 4, "unit": "unidade" }
  ],
  "availableTimeMinutes": 30
}
```

Neste processo eu aprendi:
- Microsoft Agent Framework com provider Groq (OpenAI-compatible endpoint)
- Integração MAF + `ChatResponseFormat.Json` para saída estruturada sem strict schema
- Vertical Slice Architecture em .NET 10 Minimal API
- Next.js 15 App Router com fontes otimizadas via `next/font`
- Testes de integração com xUnit + `WebApplicationFactory` + NSubstitute (mock de `IChefAgent`)
- Testes unitários de frontend com Vitest 4.x (`vi.stubGlobal("fetch", ...)`, ambiente Node, ESM)
- Prompt engineering iterativo para prevenir alucinações de LLM (receitas circulares, pratos prontos como ingredientes, tempo fictício, utensílios em ingredientes faltando)
- Extração de interface (`IChefAgent`) para viabilizar testes sem chamar API externa
- MAF best practices: Singleton lifetime, `ILogger<T>`, retry com contexto do JSON inválido, `AgentException` → HTTP 502

## Badge
<img src="https://baltaio.blob.core.windows.net/static/images/v4/challenges/may-the-fourth-2026/rewards/meal/image.png" width="200" />

## Sobre o May The Fourth 2026
O desafio **May The Fourth 2026** consiste em implementar agentes e inteligência artificial em cenários reais, resolvendo problemas do dia-a-dia com Microsoft Agent Framework, C# e .NET.

### Imersão - Microsoft Agents Framework
https://www.youtube.com/watch?v=XkgjeBurtFw

### Curso - Microsoft Agents Framework
https://balta.io/cursos/fundamentos-do-microsoft-agent-framework

### Veja meu progresso no desafio
https://github.com/balta-io/balta-desafio-may-the-fourth-2026_1-meal
