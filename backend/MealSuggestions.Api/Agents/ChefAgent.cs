using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using MealSuggestions.Api.Features.Suggestions;
using System.ClientModel;
using System.Text.Json;

namespace MealSuggestions.Api.Agents;

internal sealed class ChefAgent(ChatClientAgent agent, ILogger<ChefAgent> logger) : IChefAgent
{
    private static readonly ChatClientAgentRunOptions JsonRunOptions = new(
        new ChatOptions { ResponseFormat = ChatResponseFormat.Json });

    public async Task<SuggestRecipesResponse> SuggestAsync(
        SuggestRecipesRequest request,
        CancellationToken cancellationToken = default)
    {
        var prompt = BuildPrompt(request);

        try
        {
            var agentResponse = await ExecuteWithRetryAsync(prompt, cancellationToken);
            return Map(agentResponse);
        }
        catch (ClientResultException ex)
        {
            logger.LogError(ex, "LLM provider error. HTTP status: {Status}.", ex.Status);
            var message = ex.Status == 429
                ? "O serviço de IA está sobrecarregado. Tente novamente em instantes."
                : "Falha na comunicação com o modelo de linguagem.";
            throw new AgentException(message, ex);
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "Network error calling LLM provider.");
            throw new AgentException("Não foi possível conectar ao serviço de IA.", ex);
        }
        catch (OperationCanceledException ex) when (!cancellationToken.IsCancellationRequested)
        {
            logger.LogWarning("LLM request timed out.");
            throw new AgentException("O modelo de linguagem não respondeu a tempo.", ex);
        }
    }

    private async Task<ChefAgentResponse> ExecuteWithRetryAsync(string prompt, CancellationToken cancellationToken)
    {
        logger.LogInformation("Sending request to LLM agent.");

        var response = await agent.RunAsync(prompt, session: null, JsonRunOptions, cancellationToken);

        logger.LogDebug("LLM response received ({Length} chars).", response.Text?.Length ?? 0);

        try
        {
            return Deserialize(response.Text);
        }
        catch (JsonException ex)
        {
            logger.LogWarning(ex,
                "LLM returned invalid JSON on first attempt. Retrying with context. Raw response: {Response}",
                response.Text);

            var retryPrompt = $"""
                {prompt}

                ---
                Sua resposta anterior não era JSON válido:
                {response.Text}

                Retorne APENAS JSON puro e válido, sem texto adicional.
                """;

            var retry = await agent.RunAsync(retryPrompt, session: null, JsonRunOptions, cancellationToken);

            logger.LogDebug("LLM retry response received ({Length} chars).", retry.Text?.Length ?? 0);

            return Deserialize(retry.Text);
        }
    }

    private static ChefAgentResponse Deserialize(string? json) =>
        json is null ? new ChefAgentResponse() :
        JsonSerializer.Deserialize<ChefAgentResponse>(json, JsonSerializerOptions.Web)
        ?? new ChefAgentResponse();

    private static string BuildPrompt(SuggestRecipesRequest request)
    {
        var lines = request.Ingredients.Select(i => $"- {i.Name}: {i.Quantity} {i.Unit}");
        return $"""
            Ingredientes disponíveis:
            {string.Join(Environment.NewLine, lines)}

            Tempo disponível para cozinhar: {request.AvailableTimeMinutes} minutos
            """;
    }

    private static SuggestRecipesResponse Map(ChefAgentResponse r) =>
        new()
        {
            Recipes = [.. r.Receitas.Select(rec => new Recipe
            {
                Name = rec.Nome,
                Description = rec.Descricao,
                EstimatedTimeMinutes = rec.TempoEstimadoMinutos,
                Difficulty = rec.Dificuldade,
                Steps = rec.Passos,
                MissingIngredients = rec.IngredientesFaltando
            })]
        };
}
