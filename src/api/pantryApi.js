import { axiosClient } from './axiosClient';

/** GET /api/pantry -> { pantry: [{ name, addedAt }] } */
export async function fetchPantry() {
  return axiosClient.get('/pantry');
}

/** POST /api/pantry { name } -> { pantry } */
export async function addPantryItemApi(name) {
  return axiosClient.post('/pantry', { name });
}

/** DELETE /api/pantry/:name -> { pantry } */
export async function removePantryItemApi(name) {
  return axiosClient.delete(`/pantry/${encodeURIComponent(name)}`);
}

/** PUT /api/pantry { ingredients: string[] } -> { pantry } — bulk replace, used to sync local state on login */
export async function replacePantryApi(ingredients) {
  return axiosClient.put('/pantry', { ingredients });
}
