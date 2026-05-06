using System.Text.Json.Serialization;

namespace MealSuggestions.Api.Agents;

internal class ChefAgentResponse
{
    [JsonPropertyName("receitas")]
    public List<AgentRecipe> Receitas { get; set; } = [];
}

internal class AgentRecipe
{
    [JsonPropertyName("nome")]
    public string Nome { get; set; } = string.Empty;

    [JsonPropertyName("descricao")]
    public string Descricao { get; set; } = string.Empty;

    [JsonPropertyName("tempoEstimadoMinutos")]
    public int TempoEstimadoMinutos { get; set; }

    [JsonPropertyName("dificuldade")]
    public string Dificuldade { get; set; } = string.Empty;

    [JsonPropertyName("passos")]
    public List<string> Passos { get; set; } = [];

    [JsonPropertyName("ingredientesFaltando")]
    public List<string> IngredientesFaltando { get; set; } = [];
}
