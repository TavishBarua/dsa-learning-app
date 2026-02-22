// LocalStorage management for Gemini API key

const STORAGE_KEY = 'gemini_api_key';

/**
 * Save Gemini API key to localStorage
 * @param key - The API key to store
 */
export function saveAPIKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, key);
  }
}

/**
 * Retrieve Gemini API key from localStorage
 * @returns The stored API key or null if not found
 */
export function getAPIKey(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEY);
  }
  return null;
}

/**
 * Remove Gemini API key from localStorage
 */
export function clearAPIKey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Check if API key is set
 * @returns true if API key exists in localStorage
 */
export function hasAPIKey(): boolean {
  const key = getAPIKey();
  return key !== null && key.trim().length > 0;
}
