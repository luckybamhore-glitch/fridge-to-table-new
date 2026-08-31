import { axiosClient } from './axiosClient';

/** GET /api/favorites -> { savedRecipes: string[] } */
export async function fetchFavorites() {
  return axiosClient.get('/favorites');
}

/** POST /api/favorites/:recipeId/toggle -> { savedRecipes, saved } */
export async function toggleFavoriteApi(recipeId) {
  return axiosClient.post(`/favorites/${encodeURIComponent(recipeId)}/toggle`);
}
