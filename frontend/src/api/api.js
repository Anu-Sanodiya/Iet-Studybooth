import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API = axios.create({
    baseURL: BASE_URL,
    // Ensure cookies are sent (needed for the backend to read the JWT token from a cookie,
    // although we are primarily using Bearer headers here for simplicity)
    withCredentials: true,
});

// Request Interceptor: This runs right before every request is sent.
API.interceptors.request.use(config => {
    // 1. Get the token from local storage (set during login in AuthContext)
    const token = localStorage.getItem('token');
    
    // 2. If a token exists, attach it to the Authorization header
    if (token) {
        // This format is required by the JWT standard and is read by your backend's auth middleware.
        // Ensure headers object exists
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. Return the modified configuration for the request to proceed
    return config;
}, error => {
    // Handle request setup errors
    return Promise.reject(error);
});

export default API;