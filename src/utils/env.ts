/**
 * Environment detection utilities
 * 
 * CRITICAL: These utilities ensure the app works in both development and production.
 * Never hardcode localhost URLs in components - always use these helpers.
 */

/**
 * Checks if the app is running in development mode
 */
export const isDevelopment = (): boolean => {
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]'
  );
};

/**
 * Gets the base URL for API calls
 * 
 * In development: Returns http://localhost:8010 (explicit dev server)
 * In production: Returns empty string (relative paths, same origin)
 * 
 * @example
 * const url = `${getApiBase()}/proxy/${targetUrl}`;
 * // Development: http://localhost:8010/proxy/https://example.com
 * // Production: /proxy/https://example.com
 */
export const getApiBase = (): string => {
  if (isDevelopment()) {
    return 'http://localhost:8010';
  }
  return '';
};

/**
 * Constructs a proxy URL for fetching external resources
 * 
 * @param targetUrl - The external URL to proxy
 * @returns Full proxy URL appropriate for current environment
 * 
 * @example
 * const proxyUrl = getProxyUrl('https://api.example.com/data.json');
 * // Development: http://localhost:8010/proxy/https://api.example.com/data.json
 * // Production: /proxy/https://api.example.com/data.json
 */
export const getProxyUrl = (targetUrl: string): string => {
  return `${getApiBase()}/proxy/${targetUrl}`;
};

/**
 * Checks if a URL should use the proxy
 * 
 * @param url - The URL to check
 * @returns true if the URL should be proxied
 */
export const shouldUseProxy = (url: string): boolean => {
  // Don't proxy localhost URLs
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return false;
  }
  
  // Don't proxy relative URLs
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }
  
  return true;
};
