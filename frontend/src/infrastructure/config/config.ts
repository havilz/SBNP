/**
 * Global application configuration derived from environment variables.
 * Uses Vite's import.meta.env for desktop application compatibility.
 */

export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || "https://sbnp-production.up.railway.app/api",
    timeout: 10000,
  },
  websocket: {
    url: import.meta.env.VITE_WS_URL || "https://sbnp-production.up.railway.app/sbnp",
  },
  app: {
    env: import.meta.env.MODE || "development",
    isProduction: import.meta.env.PROD,
  },
};
