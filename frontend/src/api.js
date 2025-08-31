// Centralized API base URL for frontend
// In production, use relative path so nginx can proxy to backend
// In development, use full URL to avoid CORS issues

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Use relative path in production (nginx will proxy)
  : (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api');

export function apiFetch(path, options) {
  // Ensure no double slashes
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
  
  // Get auth token from localStorage
  const token = localStorage.getItem('authToken');
  
  // Add default headers for JSON content and auth
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers
    },
    ...options
  };
  
  return fetch(url, defaultOptions);
}

// Authentication API
export async function loginAdmin(password) {
  const response = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  
  return response.json();
}

export async function continueAsGuest() {
  const response = await apiFetch('/auth/guest', {
    method: 'POST'
  });
  
  if (!response.ok) {
    throw new Error('Failed to continue as guest');
  }
  
  return response.json();
}

export async function verifyAuth() {
  const response = await apiFetch('/auth/verify');
  
  if (!response.ok) {
    return { success: false, role: 'guest' };
  }
  
  return response.json();
}

// Server info API
export async function getServerInfo() {
  const response = await apiFetch('/server-info');
  if (!response.ok) {
    throw new Error('Failed to fetch server info');
  }
  return response.json();
}
