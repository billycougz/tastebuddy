import { useStaticQuery, graphql } from 'gatsby';
import Compressor from 'compressorjs';

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
	return isBrowser() && window.innerWidth <= 768;
}

export function isStandalone() {
	return isBrowser() && window.matchMedia('(display-mode: standalone)').matches;
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

export function compressFile(file) {
	const MAX_FILE_SIZE_MB = 0.5;

	function getRequiredCompressionQuality(file) {
		const maxFileSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
		const fileSizeBytes = file.size;
		if (fileSizeBytes <= maxFileSizeBytes) {
			// Return full quality if under max size
			return 1;
		} else {
			// Calculate proportionate quality based on file size
			const compressionQuality = maxFileSizeBytes / fileSizeBytes;
			return compressionQuality;
		}
	}

	const compressionQuality = getRequiredCompressionQuality(file);

	if (compressionQuality === 1) {
		return file;
	}

	return new Promise((resolve, reject) => {
		new Compressor(file, {
			quality: compressionQuality,
			convertSize: MAX_FILE_SIZE_MB * 1000000,
			convertTypes: ['image/png', 'image/webp'],
			success: (compressedFile) => resolve(compressedFile),
			error: (err) => reject(err.message),
		});
	});
}
