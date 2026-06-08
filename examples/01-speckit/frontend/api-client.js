/**
 * API Client Module
 * Handles all communication with the backend API
 * 
 * Configuration:
 * - BACKEND_BASE_URL: Base URL for API endpoints (can be set via environment or hardcoded)
 */

// Get backend URL from environment or use default
const BACKEND_BASE_URL = globalThis.BACKEND_BASE_URL || 'http://localhost:3000';

/**
 * Main API fetch function
 * @param {string} endpoint - The API endpoint (e.g., '/getConfig', '/submitResponse')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<object>} Parsed JSON response from server
 * @throws {Error} If network request fails or response is not ok
 */
export async function fetchJson(endpoint, options = {}) {
  const url = `${BACKEND_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const fetchOptions = {
    method: options.method || 'GET',
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  };

  // Remove headers from options to avoid duplication
  delete fetchOptions.headers;
  
  try {
    const response = await fetch(url, {
      headers: defaultHeaders,
      ...options,
    });

    // Log request for debugging
    console.debug(`[API] ${options.method || 'GET'} ${endpoint} - Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      const errorMessage = `API Error ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`;
      console.error(`[API] ${errorMessage}`);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.debug(`[API] Response received from ${endpoint}`, data);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[API] Request failed to ${endpoint}:`, error.message);
      throw error;
    }
    const networkError = new Error(`Network error: ${String(error)}`);
    console.error(`[API] Network error to ${endpoint}:`, networkError);
    throw networkError;
  }
}

/**
 * Set the backend base URL
 * Useful for dynamic configuration or testing
 * @param {string} url - The new backend base URL
 */
export function setBackendUrl(url) {
  globalThis.BACKEND_BASE_URL = url;
}

/**
 * Get the current backend URL
 * @returns {string} Current backend base URL
 */
export function getBackendUrl() {
  return globalThis.BACKEND_BASE_URL || BACKEND_BASE_URL;
}
