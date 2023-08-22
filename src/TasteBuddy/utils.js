import { useStaticQuery, graphql } from 'gatsby';

/**
 * Useful for safeguarding Gatsby build against browser APIs
 */
export function isBrowser() {
	return typeof window !== 'undefined';
}

/**
 * Useful for enabling testing features
 */
export function isDevelopment() {
	return process.env.NODE_ENV === 'development';
}

export function isMobile() {
	return window.innerWidth <= 768;
}

export function isStandalone() {
	return window.matchMedia('(display-mode: standalone)').matches;
}

export function isiOS() {
	return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isAndroid() {
	return /Android/.test(navigator.userAgent);
}

export function useAppVersion() {
	const data = useStaticQuery(graphql`
		query {
			site {
				siteMetadata {
					version
				}
			}
		}
	`);
	return data.site.siteMetadata.version;
}
