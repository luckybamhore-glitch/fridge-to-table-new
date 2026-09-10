import { axiosClient } from './axiosClient';

/**
 * Generates recipe recommendations based on input ingredients and optional diet filter.
 * API contract: POST /api/recipes/generate { ingredients: string[], diet?: string } -> { recipes: Recipe[] }
 *
 * No client-side mock fallback here — the backend already has its own
 * fallback to real MongoDB recipes (see recipeController.js's
 * `source: 'database'` path) if Gemini is unavailable. A second,
 * separate mock layer on the client just duplicates that logic and is
 * one more place for bugs to hide (as the now-empty mockData.js proved).
 * Failures are thrown so the caller (RecipeResultsPage) can show a real
 * error instead of silently swapping in fake data.
 *
 * @param {Object} params
 * @param {string[]} params.ingredients
 * @param {string} [params.diet]
 * @returns {Promise<{ recipes: Array, source: string, ingredients: string[] }>}
 */
export async function generateRecipes({ ingredients = [], diet }) {
  // This endpoint chains a Gemini recipe-generation call, a YouTube
  // lookup per recipe, and callGeminiWithRetry's own retry/backoff —
  // the client's default 12s timeout (axiosClient.js) is tuned for
  // ordinary CRUD calls and is routinely too short here, which was
  // surfacing as "timeout of 12000ms exceeded" even on successful,
  // just-slow generations. Override it for this call specifically
  // rather than loosening the timeout for every request in the app.
  const response = await axiosClient.post(
    '/recipes/generate',
    { ingredients, diet },
    { timeout: 30000 }
  );

  if (!response || !Array.isArray(response.recipes)) {
    throw new Error('Backend returned an invalid recipe response.');
  }

  return response;
}

/**
 * Fetches single recipe details by ID.
 * API contract: GET /api/recipes/:id -> { recipe: Recipe }
 *
 * @param {string} id
 * @returns {Promise<Object>} the recipe object
 */
export async function getRecipeById(id) {
  const response = await axiosClient.get(`/recipes/${id}`);

  // axiosClient already unwraps to `.data` — the backend's shape is
  // { recipe: {...} }, not the recipe's fields directly at the top level.
  if (!response || !response.recipe) {
    throw new Error('Recipe not found.');
  }

  return response.recipe;
}