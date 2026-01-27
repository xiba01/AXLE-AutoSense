/**
 * Development-only logger utility
 * Prevents console statements in production builds
 */

const isDev = import.meta.env.DEV;

export const logger = {
    /**
     * Log warning messages (development only)
     */
    warn: (...args) => {
        if (isDev) {
            console.warn(...args);
        }
    },

    /**
     * Log error messages (development only)
     */
    error: (...args) => {
        if (isDev) {
            console.error(...args);
        }
    },

    /**
     * Log general messages (development only)
     */
    log: (...args) => {
        if (isDev) {
            console.log(...args);
        }
    },

    /**
     * Log info messages (development only)
     */
    info: (...args) => {
        if (isDev) {
            console.info(...args);
        }
    },

    /**
     * Log debug messages (development only)
     */
    debug: (...args) => {
        if (isDev) {
            console.debug(...args);
        }
    },
};
