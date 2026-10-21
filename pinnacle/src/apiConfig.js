import axios from 'axios';

// Get API base URL from environment or fallback to localhost
let envUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// If Render passes a host without protocol (e.g. pinnacle-server.onrender.com), prepend https://
if (envUrl && !envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
  envUrl = 'https://' + envUrl;
}

export const API_BASE_URL = envUrl.replace(/\/+$/, '');

// Set global Axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Intercept all Axios requests so any hardcoded 'http://localhost:3001' or 'http://127.0.0.1:3001'
// is automatically redirected to the production API_BASE_URL
axios.interceptors.request.use((config) => {
  if (config.url) {
    if (config.url.startsWith('http://localhost:3001')) {
      config.url = config.url.replace('http://localhost:3001', API_BASE_URL);
    } else if (config.url.startsWith('http://127.0.0.1:3001')) {
      config.url = config.url.replace('http://127.0.0.1:3001', API_BASE_URL);
    }
  }
  config.withCredentials = true;
  return config;
});

// Intercept native fetch() calls so hardcoded URLs work seamlessly
if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch;
  window.fetch = function (resource, init = {}) {
    let newResource = resource;
    if (typeof resource === 'string') {
      if (resource.startsWith('http://localhost:3001')) {
        newResource = resource.replace('http://localhost:3001', API_BASE_URL);
      } else if (resource.startsWith('http://127.0.0.1:3001')) {
        newResource = resource.replace('http://127.0.0.1:3001', API_BASE_URL);
      }
    }
    return originalFetch(newResource, {
      credentials: 'include',
      ...init,
    });
  };
}

export default API_BASE_URL;
