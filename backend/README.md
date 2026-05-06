# Backend — MealSuggestions.Api

.NET 10 Minimal API com Microsoft Agent Framework e Groq.

## Estrutura

```
MealSuggestions.Api/
├── Agents/
│   ├── IChefAgent.cs
│   ├── AgentException.cs     ← exceção de domínio mapeada para 502 no handler
│   ├── ChefAgent.cs          ← executa MAF, logging via ILogger, retry inteligente com contexto, tratamento de ClientResultException/HttpRequestException
│   └── ChefAgentResponse.cs  ← modelo interno (campos em pt-BR do LLM)
├── Features/Suggestions/
│   ├── SuggestRecipesEndpoint.cs
│   ├── SuggestRecipesHandler.cs  ← validação FluentValidation + orquestra agent + captura AgentException → 502
│   ├── SuggestRecipesRequest.cs
│   └── SuggestRecipesResponse.cs
├── Infrastructure/Llm/
│   └── GroqClientFactory.cs  ← instancia ChatClientAgent via MAF + Groq
├── Program.cs                ← IChefAgent registrado como Singleton
├── appsettings.json
└── appsettings.Development.json  ← gitignored, contém ApiKey

MealSuggestions.Api.Tests/
├── SuggestionsApiFactory.cs  ← WebApplicationFactory com IChefAgent mockado (NSubstitute)
└── SuggestRecipesTests.cs    ← 9 testes: 4 validação 400, 3 happy path 200, 2 AgentException → 502
```

## Como rodar

```bash
cd MealSuggestions.Api
dotnet run
# API em http://localhost:5000
# Swagger UI em http://localhost:5000/swagger/index.html
```

## Como testar

```bash
cd MealSuggestions.Api.Tests
dotnet test
```

## Configuração

Criar `MealSuggestions.Api/appsettings.Development.json` (gitignored):

```json
{
  "Llm": {
    "ApiKey": "gsk_SUA_CHAVE_GROQ"
  }
}
```

`BaseUrl` e `Model` já estão em `appsettings.json`.

## Endpoint

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

Retorna `400` para request inválido, `200` com array de até 3 receitas.

## CORS

Configurado para aceitar `http://localhost:3000` e `http://localhost:3001` (Next.js sobe na 3001 quando a 3000 está ocupada).
