import axios from 'axios';

function getUserCoordinates() {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				resolve({ latitude, longitude });
			},
			(error) => {
				reject(error);
			}
		);
	});
}

const exampleLocations = {
	backeast: '41.855152304274164,-72.70496750888017',
	brignole: '41.94191934334896,-72.7763922676702',
};

const API_URL = 'https://gem7gutc6mwzchwotddzebsxu40boetu.lambda-url.us-east-1.on.aws/';

export async function fetchNearbyPlaces() {
	let coordinates = {};
	try {
		coordinates = await getUserCoordinates();
	} catch (e) {
		console.log('Location services are disabled');
		return null;
	}
	const { latitude, longitude } = coordinates;
	try {
		const requestBody = {
			operation: 'nearby',
			location: exampleLocations.backeast, // `${latitude},${longitude}`,
			radius: 1000,
		};

		const response = await axios.post(API_URL, requestBody);

		if (response.status === 200) {
			const { results } = response.data;
			return results.filter(({ types }) => types.includes('establishment'));
		} else {
			throw new Error('No nearby search results');
		}
	} catch (error) {
		console.error('Error fetching nearby places:', error.message);
		return [];
	}
}
