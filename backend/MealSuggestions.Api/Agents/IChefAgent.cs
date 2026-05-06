using MealSuggestions.Api.Features.Suggestions;

namespace MealSuggestions.Api.Agents;

public interface IChefAgent
{
    Task<SuggestRecipesResponse> SuggestAsync(SuggestRecipesRequest request, CancellationToken cancellationToken = default);
}
