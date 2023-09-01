import { isBrowser } from './utils';

const PREFERENCES_KEY = 'tastebuddy-preferences';
const REVIEWS_KEY = 'tasebuddy-reviews';
const FEEDBACK_GROUP_KEY = 'tastebuddy-fg';
const USER_PROFILE_KEY = 'tastebuddy-user-profile';
const VERSION_KEY = 'tastebuddy-version';
const USAGE_METADATA_KEY = 'tastebuddy-usage-metadata';

const mockLocalStorage = {
	getItem: () => {},
	setItem: () => {},
	removeItem: () => {},
};

const localStorage = isBrowser() ? window.localStorage : mockLocalStorage;

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

export function getUserProfile() {
	const rawValue = localStorage.getItem(USER_PROFILE_KEY);
	const data = rawValue ? JSON.parse(rawValue) : {};
	return data;
}

export function updateUserProfile(newProfile) {
	localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile));
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
	const groups = getFeedbackGroups();

	const GATSBY_WINDOW = typeof window !== 'undefined' ? window : null;
	if (GATSBY_WINDOW) {
		const url = new URL(GATSBY_WINDOW?.location?.href);
		const groupId = url?.searchParams.get('fg'); // 'fg' to represent feedback-group

		if (groupId) {
			// The below two lines will remove the fg param from the URL and history
			// url?.searchParams.delete('fg');
			// GATSBY_WINDOW?.history.replaceState({}, document?.title, url?.toString());

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

export function getFeedbackGroups() {
	const rawValue = localStorage.getItem(FEEDBACK_GROUP_KEY);
	return rawValue ? JSON.parse(localStorage.getItem(FEEDBACK_GROUP_KEY)) : [];
}

export function storeAppVersion(version) {
	localStorage.setItem(VERSION_KEY, version);
}

// ToDo - handle better
export function updateUsageMetadata(version) {
	const data = getMetadata(true);
	data.accessCount++;
	localStorage.setItem(USAGE_METADATA_KEY, JSON.stringify(data));
	storeFeedbackGroup();
	storeAppVersion(version);
	storeAppVersion(version);
}

// ToDo - handle better
export function getMetadata(usageOnly) {
	const rawValue = localStorage.getItem(USAGE_METADATA_KEY);
	const usage = rawValue
		? JSON.parse(rawValue)
		: {
				firstAccessed: Date.now(),
				accessCount: 1,
		  };
	return usageOnly
		? usage
		: {
				appVersion: getAppVersion(),
				feedbackGroups: getFeedbackGroups(),
				userProfile: getUserProfile(),
				...usage,
		  };
}

// ToDo - be careful with this - race condition - dependant on useAppVersion hook in utils
export function getAppVersion() {
	return localStorage.getItem(VERSION_KEY);
}

function getStoredValue(key, defaultValue, isJson) {
	const rawValue = localStorage.getItem(key);
	if (rawValue) {
		return isJson ? JSON.parse(rawValue) : rawValue;
	}
	return defaultValue;
}
