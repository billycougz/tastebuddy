/**
 * Useful for safeguarding Gatsby build against browser APIs
 * @returns {boolean}
 */
export function isBrowser() {
	return typeof window !== 'undefined';
}
