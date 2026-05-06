namespace MealSuggestions.Api.Features.Suggestions;

public class SuggestRecipesResponse
{
    public List<Recipe> Recipes { get; set; } = [];
}

public class Recipe
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int EstimatedTimeMinutes { get; set; }
    public string Difficulty { get; set; } = string.Empty;
    public List<string> Steps { get; set; } = [];
    public List<string> MissingIngredients { get; set; } = [];
}
