/**
 * Single place where `import.meta.env` is read, so nothing else in the app has
 * to know about Vite's env plumbing (and tests can stub this module).
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  appName: import.meta.env.VITE_APP_NAME || 'TechnoVolt',
  isDev: import.meta.env.DEV,
};
