// Centralized API base URL for frontend
// Uses environment variable if available, otherwise defaults to relative path (works with nginx proxy)

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

export function apiFetch(path, options) {
  // Ensure no double slashes
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
  return fetch(url, options);
}
