/**
 * Production-safe logger. Strips console.log in production builds.
 * Use this instead of console.log throughout the app.
 */
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args) => isDev && console.log('[DevLog]', ...args),
  warn: (...args) => isDev && console.warn('[DevLog]', ...args),
  error: (...args) => console.error('[DevLog]', ...args), // always log errors
  debug: (...args) => isDev && console.debug('[DevLog]', ...args),
};
