import { axiosClient } from './axiosClient';

/**
 * API contract: POST /api/auth/register { name, email, password } -> { user, accessToken }
 */
export async function registerUser({ name, email, password }) {
  return axiosClient.post('/auth/register', { name, email, password });
}

/**
 * API contract: POST /api/auth/login { email, password } -> { user, accessToken }
 */
export async function loginUser({ email, password }) {
  return axiosClient.post('/auth/login', { email, password });
}

/**
 * API contract: POST /api/auth/logout -> { message }
 */
export async function logoutUser() {
  return axiosClient.post('/auth/logout');
}

/**
 * API contract: GET /api/auth/me -> { user }  (requires Authorization header)
 */
export async function fetchCurrentUser() {
  return axiosClient.get('/auth/me');
}

/**
 * API contract: POST /api/auth/refresh -> { accessToken }  (reads httpOnly cookie)
 */
export async function refreshSession() {
  return axiosClient.post('/auth/refresh');
}
