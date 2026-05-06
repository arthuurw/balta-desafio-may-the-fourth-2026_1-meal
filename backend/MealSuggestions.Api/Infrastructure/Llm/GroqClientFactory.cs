using Microsoft.Agents.AI;
using OpenAI;
using OpenAI.Chat;
using System.ClientModel;

namespace MealSuggestions.Api.Infrastructure.Llm;

internal static class GroqClientFactory
{
    internal static ChatClientAgent CreateChefAgent(IConfiguration configuration)
    {
        var apiKey = configuration["Llm:ApiKey"]
            ?? throw new InvalidOperationException("Llm:ApiKey not configured.");
        var baseUrl = configuration["Llm:BaseUrl"]
            ?? throw new InvalidOperationException("Llm:BaseUrl not configured.");
        var model = configuration["Llm:Model"]
            ?? throw new InvalidOperationException("Llm:Model not configured.");

        var agentFilePath = Path.Combine(AppContext.BaseDirectory, "agents", "agente-chef-de-cozinha.md");
        var instructions = File.ReadAllText(agentFilePath);

        var client = new OpenAIClient(
            new ApiKeyCredential(apiKey),
            new OpenAIClientOptions { Endpoint = new Uri(baseUrl) });

        return client
            .GetChatClient(model)
            .AsAIAgent(instructions: instructions, name: "ChefAgent");
    }
}
