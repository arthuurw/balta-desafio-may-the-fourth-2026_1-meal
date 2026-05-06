namespace MealSuggestions.Api.Features.Suggestions;

public class SuggestRecipesRequest
{
    public List<Ingredient> Ingredients { get; set; } = [];
    public int AvailableTimeMinutes { get; set; }
}

public class Ingredient
{
    public string Name { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
}
