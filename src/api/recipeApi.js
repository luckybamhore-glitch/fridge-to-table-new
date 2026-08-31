import { axiosClient } from './axiosClient';
import { MOCK_RECIPES } from './mockData';

/**
 * Generates recipe recommendations based on input ingredients and optional diet filter.
 * API contract: POST /api/recipes/generate { ingredients: string[], diet?: string } -> { recipes: Recipe[] }
 *
 * @param {Object} params
 * @param {string[]} params.ingredients
 * @param {string} [params.diet]
 * @returns {Promise<{ recipes: Array }>}
 */
export async function generateRecipes({ ingredients = [], diet }) {
  try {
    const response = await axiosClient.post('/recipes/generate', { ingredients, diet });
    if (response && Array.isArray(response.recipes)) {
      return response;
    }
  } catch (err) {
    console.info('Using local mock recipe generation handler:', err?.message);
  }

  // Simulate network & AI processing delay (1.2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const lowerInputs = ingredients.map((i) => i.toLowerCase().trim());

  // Dynamic match percentage & ingredient status mapping for demo realism
  const processedRecipes = MOCK_RECIPES.map((recipe) => {
    const updatedIngredients = recipe.ingredients.map((ing) => {
      const ingLower = ing.name.toLowerCase();
      const hasMatch = lowerInputs.some(
        (userIng) => ingLower.includes(userIng) || userIng.includes(ingLower)
      );
      return {
        ...ing,
        have: hasMatch || ing.have,
      };
    });

    const haveCount = updatedIngredients.filter((ing) => ing.have).length;
    const matchPercent = Math.min(
      98,
      Math.max(65, Math.round((haveCount / updatedIngredients.length) * 100))
    );

    return {
      ...recipe,
      ingredients: updatedIngredients,
      matchPercent,
    };
  });

  // Filter by diet if specified
  let filtered = processedRecipes;
  if (diet && diet !== 'All') {
    filtered = processedRecipes.filter(
      (r) => r.diet.map((d) => d.toLowerCase()).includes(diet.toLowerCase())
    );
    if (filtered.length === 0) filtered = processedRecipes; // Fallback so user gets results
  }

  // Sort by match percentage descending
  filtered.sort((a, b) => b.matchPercent - a.matchPercent);

  return { recipes: filtered };
}

/**
 * Fetches single recipe details by ID.
 * API contract: GET /api/recipes/:id -> Recipe
 *
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getRecipeById(id) {
  try {
    const response = await axiosClient.get(`/recipes/${id}`);
    if (response && response.id) {
      return response;
    }
  } catch (err) {
    console.info('Using local mock recipe fetch handler:', err?.message);
  }

  await new Promise((resolve) => setTimeout(resolve, 300));
  const found = MOCK_RECIPES.find((r) => r.id === id) || MOCK_RECIPES[0];
  return found;
}
