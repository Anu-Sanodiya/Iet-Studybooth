import API from '../api/api';

// API paths corresponding to the backend's auth router
const AUTH_BASE = '/auth';

/**
 * Registers a new user on the backend.
 * @param {object} userData - User details { name, email, password, role }.
 * @returns {Promise<object>} Response data containing { user, token }.
 */
export const registerUser = async (userData) => {
  // The API client handles: http://localhost:5000/api + AUTH_BASE + /register
  const response = await API.post(`${AUTH_BASE}/register`, userData);
  return response.data;
};

/**
 * Logs a user in.
 * @param {object} userData - User credentials { email, password }.
 * @returns {Promise<object>} Response data containing { user, token }.
 */
export const loginUser = async (userData) => {
  // The API client handles: http://localhost:5000/api + AUTH_BASE + /login
  const response = await API.post(`${AUTH_BASE}/login`, userData);
  return response.data;
};

/**
 * Logs out the current user (clears server-side cookies/sessions if applicable).
 * Note: Local storage cleanup is handled by AuthContext.
 */
export const logoutUser = async () => {
  // The API client handles: http://localhost:5000/api + AUTH_BASE + /logout
  await API.post(`${AUTH_BASE}/logout`);
};