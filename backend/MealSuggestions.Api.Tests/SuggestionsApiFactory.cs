using MealSuggestions.Api.Agents;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;

namespace MealSuggestions.Api.Tests;

public class SuggestionsApiFactory : WebApplicationFactory<Program>
{
    public IChefAgent ChefAgent { get; } = Substitute.For<IChefAgent>();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            var existing = services.SingleOrDefault(d => d.ServiceType == typeof(IChefAgent));
            if (existing is not null) services.Remove(existing);

            services.AddSingleton(ChefAgent);
        });
    }
}
