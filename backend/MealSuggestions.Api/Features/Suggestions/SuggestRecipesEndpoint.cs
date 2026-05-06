namespace MealSuggestions.Api.Features.Suggestions;

internal static class SuggestRecipesEndpoint
{
    internal static void Map(WebApplication app)
    {
        app.MapPost("/api/suggestions", SuggestRecipesHandler.HandleAsync)
            .WithName("SuggestRecipes")
            .WithSummary("Sugere receitas com base nos ingredientes e tempo disponível")
            .WithTags("Suggestions")
            .Produces<SuggestRecipesResponse>(StatusCodes.Status200OK)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
