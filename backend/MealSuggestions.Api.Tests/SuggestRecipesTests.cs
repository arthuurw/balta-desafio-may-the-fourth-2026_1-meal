using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using MealSuggestions.Api.Agents;
using MealSuggestions.Api.Features.Suggestions;
using NSubstitute;

namespace MealSuggestions.Api.Tests;

public class SuggestRecipesTests(SuggestionsApiFactory factory)
    : IClassFixture<SuggestionsApiFactory>, IAsyncLifetime
{
    private readonly HttpClient _client = factory.CreateClient();

    public Task InitializeAsync()
    {
        factory.ChefAgent.ClearReceivedCalls();
        return Task.CompletedTask;
    }

    public Task DisposeAsync() => Task.CompletedTask;

    private static readonly SuggestRecipesRequest ValidRequest = new()
    {
        Ingredients = [new Ingredient { Name = "ovo", Quantity = 4, Unit = "unidade" }],
        AvailableTimeMinutes = 30
    };

    // ── Validation (400) ──────────────────────────────────────────────────────

    [Fact]
    public async Task EmptyIngredients_Returns400()
    {
        var request = new SuggestRecipesRequest { Ingredients = [], AvailableTimeMinutes = 30 };

        var response = await _client.PostAsJsonAsync("/api/suggestions", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("Informe ao menos um ingrediente", body);
    }

    [Fact]
    public async Task ZeroTime_Returns400()
    {
        var request = new SuggestRecipesRequest
        {
            Ingredients = [new Ingredient { Name = "ovo", Quantity = 1, Unit = "unidade" }],
            AvailableTimeMinutes = 0
        };

        var response = await _client.PostAsJsonAsync("/api/suggestions", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("tempo disponível deve ser maior que zero", body);
    }

    [Fact]
    public async Task EmptyIngredientName_Returns400()
    {
        var request = new SuggestRecipesRequest
        {
            Ingredients = [new Ingredient { Name = "", Quantity = 1, Unit = "unidade" }],
            AvailableTimeMinutes = 30
        };

        var response = await _client.PostAsJsonAsync("/api/suggestions", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("Nome do ingrediente não pode ser vazio", body);
    }

    [Fact]
    public async Task ZeroQuantity_Returns400()
    {
        var request = new SuggestRecipesRequest
        {
            Ingredients = [new Ingredient { Name = "ovo", Quantity = 0, Unit = "unidade" }],
            AvailableTimeMinutes = 30
        };

        var response = await _client.PostAsJsonAsync("/api/suggestions", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("Quantidade deve ser maior que zero", body);
    }

    // ── Happy path (200) ──────────────────────────────────────────────────────

    [Fact]
    public async Task ValidRequest_Returns200WithRecipes()
    {
        factory.ChefAgent
            .SuggestAsync(Arg.Any<SuggestRecipesRequest>(), Arg.Any<CancellationToken>())
            .Returns(new SuggestRecipesResponse
            {
                Recipes =
                [
                    new Recipe
                    {
                        Name = "Omelete simples",
                        Description = "Rápido e fácil.",
                        EstimatedTimeMinutes = 10,
                        Difficulty = "fácil",
                        Steps = ["Bata os ovos.", "Cozinhe na frigideira."],
                        MissingIngredients = []
                    }
                ]
            });

        var response = await _client.PostAsJsonAsync("/api/suggestions", ValidRequest);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<SuggestRecipesResponse>(JsonSerializerOptions.Web);
        Assert.NotNull(body);
        Assert.Single(body.Recipes);
        Assert.Equal("Omelete simples", body.Recipes[0].Name);
        Assert.Equal("fácil", body.Recipes[0].Difficulty);
        Assert.Empty(body.Recipes[0].MissingIngredients);
    }

    [Fact]
    public async Task ValidRequest_AgentReturnsEmptyList_Returns200WithEmptyRecipes()
    {
        factory.ChefAgent
            .SuggestAsync(Arg.Any<SuggestRecipesRequest>(), Arg.Any<CancellationToken>())
            .Returns(new SuggestRecipesResponse { Recipes = [] });

        var response = await _client.PostAsJsonAsync("/api/suggestions", ValidRequest);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<SuggestRecipesResponse>(JsonSerializerOptions.Web);
        Assert.NotNull(body);
        Assert.Empty(body.Recipes);
    }

    [Fact]
    public async Task ValidRequest_ForwardsIngredientsToAgent()
    {
        factory.ChefAgent
            .SuggestAsync(Arg.Any<SuggestRecipesRequest>(), Arg.Any<CancellationToken>())
            .Returns(new SuggestRecipesResponse());

        await _client.PostAsJsonAsync("/api/suggestions", ValidRequest);

        await factory.ChefAgent.Received(1)
            .SuggestAsync(
                Arg.Is<SuggestRecipesRequest>(r =>
                    r.Ingredients.Count == 1 &&
                    r.Ingredients[0].Name == "ovo" &&
                    r.AvailableTimeMinutes == 30),
                Arg.Any<CancellationToken>());
    }

    // ── Agent errors (502) ────────────────────────────────────────────────────

    [Fact]
    public async Task AgentThrowsAgentException_Returns502WithDetail()
    {
        factory.ChefAgent
            .SuggestAsync(Arg.Any<SuggestRecipesRequest>(), Arg.Any<CancellationToken>())
            .Returns(Task.FromException<SuggestRecipesResponse>(
                new AgentException("O serviço de IA está sobrecarregado. Tente novamente em instantes.")));

        var response = await _client.PostAsJsonAsync("/api/suggestions", ValidRequest);

        Assert.Equal(HttpStatusCode.BadGateway, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("sobrecarregado", body);
    }

    [Fact]
    public async Task AgentThrowsAgentException_ReturnsFailureTitle()
    {
        factory.ChefAgent
            .SuggestAsync(Arg.Any<SuggestRecipesRequest>(), Arg.Any<CancellationToken>())
            .Returns(Task.FromException<SuggestRecipesResponse>(
                new AgentException("Falha na comunicação com o modelo de linguagem.")));

        var response = await _client.PostAsJsonAsync("/api/suggestions", ValidRequest);

        Assert.Equal(HttpStatusCode.BadGateway, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("Falha no agente de IA", body);
    }
}
