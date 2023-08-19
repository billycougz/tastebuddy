/**
 * Useful for safeguarding Gatsby build against browser APIs
 * @returns {boolean}
 */
export function isBrowser() {
	return typeof window !== 'undefined';
}

/**
 * Useful for enabling testing features
 * @returns {boolean}
 */
export function isDevelopment() {
	return process.env.NODE_ENV === 'development';
}
