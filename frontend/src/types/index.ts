export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeSuggestionRequest {
  ingredients: Ingredient[];
  availableTimeMinutes: number;
}

export interface Recipe {
  name: string;
  description: string;
  estimatedTimeMinutes: number;
  difficulty: string;
  steps: string[];
  missingIngredients: string[];
}

export interface RecipeSuggestionResponse {
  recipes: Recipe[];
}
