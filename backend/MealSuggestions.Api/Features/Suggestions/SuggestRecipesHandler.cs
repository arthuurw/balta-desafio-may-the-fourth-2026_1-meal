using FluentValidation;
using MealSuggestions.Api.Agents;
using Microsoft.AspNetCore.Mvc;

namespace MealSuggestions.Api.Features.Suggestions;

internal static class SuggestRecipesHandler
{
    internal static async Task<IResult> HandleAsync(
        SuggestRecipesRequest request,
        [FromServices] IValidator<SuggestRecipesRequest> validator,
        IChefAgent chefAgent,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
            return Results.ValidationProblem(validation.ToDictionary());

        try
        {
            var response = await chefAgent.SuggestAsync(request, cancellationToken);
            return Results.Ok(response);
        }
        catch (AgentException ex)
        {
            return Results.Problem(
                detail: ex.Message,
                statusCode: StatusCodes.Status502BadGateway,
                title: "Falha no agente de IA");
        }
    }
}

internal sealed class SuggestRecipesValidator : AbstractValidator<SuggestRecipesRequest>
{
    public SuggestRecipesValidator()
    {
        RuleFor(x => x.Ingredients)
            .NotEmpty()
            .WithMessage("Informe ao menos um ingrediente.");

        RuleFor(x => x.AvailableTimeMinutes)
            .GreaterThan(0)
            .WithMessage("O tempo disponível deve ser maior que zero.");

        RuleForEach(x => x.Ingredients).ChildRules(ingredient =>
        {
            ingredient.RuleFor(i => i.Name)
                .NotEmpty()
                .WithMessage("Nome do ingrediente não pode ser vazio.");

            ingredient.RuleFor(i => i.Quantity)
                .GreaterThan(0)
                .WithMessage("Quantidade deve ser maior que zero.");
        });
    }
}
