// Centralized API base URL for frontend
// In production, use relative path so nginx can proxy to backend
// In development, use full URL to avoid CORS issues

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Use relative path in production (nginx will proxy)
  : (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api');

console.error('env:', process.env.NODE_ENV);
console.error('API_BASE_URL:', API_BASE_URL);

export function apiFetch(path, options) {
  // Ensure no double slashes
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
  
  // Add default headers for JSON content
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options?.headers
    },
    ...options
  };
  
  return fetch(url, defaultOptions);
}

// Server info API
export async function getServerInfo() {
  const response = await apiFetch('/server-info');
  if (!response.ok) {
    throw new Error('Failed to fetch server info');
  }
  return response.json();
}
