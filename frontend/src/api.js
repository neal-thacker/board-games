// Centralized API base URL for frontend
// In development, use proxy to avoid CORS issues
// In production, uses environment variable or defaults to relative path

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '/api'  // Use proxy in development
  : (process.env.REACT_APP_API_BASE_URL || '/api');

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
