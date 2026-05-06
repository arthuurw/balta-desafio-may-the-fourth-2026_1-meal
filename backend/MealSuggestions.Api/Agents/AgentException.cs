namespace MealSuggestions.Api.Agents;

internal sealed class AgentException : Exception
{
    internal AgentException(string message) : base(message) { }
    internal AgentException(string message, Exception inner) : base(message, inner) { }
}
