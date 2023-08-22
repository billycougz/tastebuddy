import axios from 'axios';

let CACHED_COORDINATES = {};
const API_URL = 'https://gem7gutc6mwzchwotddzebsxu40boetu.lambda-url.us-east-1.on.aws/';
const EXAMPLES = {
	backeast: '41.855152304274164,-72.70496750888017',
	brignole: '41.94191934334896,-72.7763922676702',
};

function isCacheValid() {
	const { timestamp } = CACHED_COORDINATES;
	if (!timestamp) {
		return false;
	}
	return (Date.now() - timestamp) / 1000 < 600; // 600 = 10 mins (60 secs * 10 mins)
}

function getUserCoordinates() {
	if (typeof window === 'undefined') {
		return;
	}
	if (isCacheValid()) {
		console.log('Returning cached coordinates');
		return CACHED_COORDINATES.coordinates;
	}
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const coordinates = position.coords;
				CACHED_COORDINATES = {
					coordinates,
					timestamp: Date.now(),
				};
				console.log('Returning fresh coordinates');
				resolve(coordinates);
			},
			(error) => {
				console.log('Error obtaining coordinates');
				reject(error);
			}
		);
	});
}

export async function fetchNearbyPlaces() {
	let coordinates = {};
	try {
		coordinates = await getUserCoordinates();
	} catch (e) {
		return null;
	}
	return fetchLocations({ operation: 'nearby', coordinates });
}

export async function autocompletePlaces(input) {
	let coordinates = null;
	try {
		coordinates = await getUserCoordinates();
	} catch (e) {}
	return fetchLocations({ operation: 'autocomplete', input, coordinates, types: 'establishment' });
}

async function fetchLocations({ operation, input, coordinates, types }) {
	const { latitude, longitude } = coordinates || {};
	const requestBody = {
		operation,
		input,
		types,
		location: coordinates ? `${latitude},${longitude}` : undefined,
		radius: 1000,
	};
	try {
		const response = await axios.post(API_URL, requestBody);
		if (response.status === 200) {
			const { results, predictions } = response.data;
			if (operation === 'nearby') {
				return results.filter(({ types }) => types.includes('establishment'));
			}
			if (operation === 'autocomplete') {
				return predictions.filter(({ types }) => types.includes('establishment'));
			}
		} else {
			throw new Error('No nearby search results');
		}
	} catch (e) {
		console.error('Error fetching locations:', e.message);
		return [];
	}
}
