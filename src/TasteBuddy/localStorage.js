const PREFERENCES_KEY = 'tastebuddy-preferences';
const REVIEWS_KEY = 'tasebuddy-reviews';
const FEEDBACK_GROUP_KEY = 'tastebuddy-fg';

const localStorage =
	typeof window !== 'undefined'
		? window.localStorage
		: {
				getItem: () => {},
				setItem: () => {},
				removeItem: () => {},
		  };

export default localStorage;

export function getPreferences() {
	const rawValue = localStorage.getItem(PREFERENCES_KEY);
	const emptyPreferences = {
		allergies: [],
		likes: [],
		dislikes: [],
	};
	const preferences = rawValue ? JSON.parse(rawValue) : emptyPreferences;
	return preferences;
}

export function savePreferences(preferences) {
	const stringifiedPreferences = JSON.stringify(preferences);
	localStorage.setItem(PREFERENCES_KEY, stringifiedPreferences);
}

export function getReviews() {
	const rawValue = localStorage.getItem(REVIEWS_KEY);
	const reviews = rawValue ? JSON.parse(rawValue) : [];
	return reviews;
}

export function saveReview(review) {
	const reviews = getReviews();
	reviews.unshift(review);
	const stringifiedReviews = JSON.stringify(reviews);
	localStorage.setItem(REVIEWS_KEY, stringifiedReviews);
}

export function isSameVersion() {
	const CURRENT_VERSION = 1;
	const VERSION_KEY = 'tastebuddy-version';

	// Get version config
	const rawValue = localStorage.getItem(VERSION_KEY);
	const versionObject = rawValue ? JSON.parse(rawValue) : {};
	const isSameVersion = CURRENT_VERSION === versionObject.version;

	// Update and store new version config
	versionObject.version = CURRENT_VERSION;
	versionObject.timestamp = Date.now();
	const stringified = JSON.stringify(versionObject);
	localStorage.setItem(VERSION_KEY, stringified);
	return isSameVersion;
}

export function storeFeedbackGroup() {
	const rawValue = localStorage.getItem(FEEDBACK_GROUP_KEY);
	const groups = rawValue ? JSON.parse(rawValue) : [];

	const GATSBY_WINDOW = typeof window !== 'undefined' ? window : null;
	if (GATSBY_WINDOW) {
		const url = new URL(GATSBY_WINDOW?.location?.href);
		const groupId = url?.searchParams.get('fg'); // 'fg' to represent feedback-group

		if (groupId) {
			url?.searchParams.delete('fg');
			GATSBY_WINDOW?.history.replaceState({}, document?.title, url?.toString());

			if (!groups.some((id) => id === groupId)) {
				groups.push(groupId);
			}
		}

		if (groups.length) {
			localStorage.setItem(FEEDBACK_GROUP_KEY, JSON.stringify(groups));
		}

		return groups;
	}
	// ToDo: Address this, shouldn't be needed (Gatsby window...)
	return null;
}
