import axios from 'axios';

// Create a centralized Axios instance
export const apiClient = axios.create({
  // Use relative URL so the Vite proxy handles it in dev,
  // and the same-origin reverse proxy handles it in prod.
  baseURL: '/api',
  // Ensure cookies (like sessionid and csrftoken) are sent with every request
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to safely read cookies by name
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Add a request interceptor to automatically attach the CSRF token
apiClient.interceptors.request.use((config) => {
  // Django sets the CSRF token in the 'csrftoken' cookie
  const csrfToken = getCookie('csrftoken');
  
  if (csrfToken && config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});
