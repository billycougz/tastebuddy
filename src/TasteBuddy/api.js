import axios from 'axios';
import axiosRetry from 'axios-retry';
import { getMetadata } from './localStorage';
import { Auth } from 'aws-amplify';

axiosRetry(axios, { retries: 1, retryDelay: axiosRetry.exponentialDelay });

async function getAuthHeaders() {
	const session = await Auth.currentSession();
	const idToken = session.getIdToken().getJwtToken();
	return { Authorization: idToken };
}

const __MOCK__ = Boolean(process.env.MOCK_API_RESPONSE);

const API_ENDPOINT = process.env.TASTEBUDDY_API_URL;

/**
 * @param {*} files array files from a file input
 * @returns {string[]} array of s3Filenames
 */
export async function uploadMenu(files) {
	if (__MOCK__) {
		return ['85242caa-bb70-4826-ba19-b373c2b967e2.jpg'];
	}

	const headers = await getAuthHeaders();

	/**
	 * @param {*} files array files from a file input
	 * @returns dictionary of [localFilename]: { uploadUrl, s3Filename }
	 */
	async function generatePresignedUrls(files) {
		const filenames = files.map(({ name }) => name);
		const response = await axios.post(
			API_ENDPOINT,
			{
				operation: 'generate-presigned-urls',
				filenames,
			},
			{ headers }
		);
		if (response?.data) {
			return response.data;
		}
		throw new Error('There was an error inside generatePresignedUrls()');
	}

	/**
	 * @param {*} files array files from a file input
	 * @param {*} fileUploadMap dictionary of [localFilename]: { uploadUrl, s3Filename }
	 * @returns {Promise<void>} async/awaitable but no return value
	 */
	async function uploadFiles(files, fileUploadMap) {
		const promises = files.map((file) => {
			const { uploadUrl } = fileUploadMap[file.name];
			return axios.put(uploadUrl, file, { headers: { 'Content-Type': file.type } });
		});
		await Promise.all(promises);
	}

	/**
	 * Orchestrate file upload using presigned URLs
	 */
	const fileUploadMap = await generatePresignedUrls(files);
	await uploadFiles(files, fileUploadMap);
	return Object.values(fileUploadMap).map(({ s3Filename }) => s3Filename);
}

export async function searchMenu({ category, menuIds, menuType, mood, preferences }) {
	if (__MOCK__) {
		return {
			message: 'Here are some options that satisfy your spicy mood:',
			establishment: "Carbone's Kitchen",
			results: [
				{
					name: 'ITALIAN BOMB',
					description: 'mozz, sausage, pepperoni, meatball, onion, roasted pepper',
					reason: 'This item is spicy and satisfies your craving for some heat.',
					price: 15,
				},
				{
					name: 'CHICKEN SCARPARIELLO',
					description: 'chicken skewers, stuffed cherry peppers',
					reason: 'This dish is spicy and has a delicious blend of flavors.',
					price: 14,
				},
				{
					name: "NICK'S PEPPERONI",
					description: 'tomato sauce, fresh mozz, calabrian chili flakes, local honey',
					reason: 'This pizza has a nice kick of spice from the calabrian chili flakes.',
					price: 14,
				},
			],
		};
	}
	const headers = await getAuthHeaders();
	const payload = {
		operation: 'search-menu',
		extract_names: menuIds,
		preferences: { menuType, category, mood, ...preferences },
	};
	try {
		const response = await axios.post(API_ENDPOINT, payload, { headers });
		if (response.data) {
			return response.data;
		}
	} catch (e) {
		console.log(e);
		throw new Error(e);
	}
	throw new Error('There was an error with the askQuestion() request.');
}

export async function postFeedback(feedback) {
	const url = 'https://idv6trz3sxytzji2e57rbpz2ma0sqtyj.lambda-url.us-east-1.on.aws/';
	const data = {
		app: 'TasteBuddy',
		...feedback,
		...flattenObject(getMetadata()), // ToDo
	};
	const response = await axios.post(url, data);
	if (response.data) {
		return response.data;
	}
}

// ToDo - Don't do this...
function flattenObject(obj, prefix = '') {
	return Object.keys(obj).reduce((acc, key) => {
		const prop = prefix + key;
		if (typeof obj[key] === 'object') {
			Object.assign(acc, flattenObject(obj[key], prop + '.'));
		} else {
			acc[prop] = obj[key];
		}
		return acc;
	}, {});
}
