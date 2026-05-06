using FluentValidation;
using MealSuggestions.Api.Agents;
using MealSuggestions.Api.Features.Suggestions;
using MealSuggestions.Api.Infrastructure.Llm;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddValidatorsFromAssemblyContaining<SuggestRecipesValidator>(includeInternalTypes: true);

builder.Services.AddSingleton(sp =>
    GroqClientFactory.CreateChefAgent(sp.GetRequiredService<IConfiguration>()));

builder.Services.AddSingleton<IChefAgent, ChefAgent>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

SuggestRecipesEndpoint.Map(app);

await app.RunAsync();

public partial class Program { }
