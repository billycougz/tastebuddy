import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import { Input, Paragraph, Button } from '../styles';
import { autocompletePlaces } from '../location-services';

const ModalContainer = styled.div`
	background-color: #1f1f1f;
	color: #fff;
	padding: 20px;
	margin: 1rem -1rem;
	box-sizing: border-box;
`;

const DarkModeList = styled.ul`
	list-style: none;
	padding: 0;
	background-color: #1f1f1f;
`;

const LocationItem = styled.li`
	border-bottom: 1px solid #444;
	cursor: pointer;
`;

const LocationName = styled.h3`
	font-size: 1.2rem;
	margin-bottom: 5px;
`;

const mockLocations = [
	{
		id: 1,
		name: 'Mock Restaurant 1',
		vicinity: '123 Mock Street, Mocksville',
	},
	{
		id: 2,
		name: 'Mock Cafe',
		vicinity: '456 Java Avenue, Brewville',
	},
	{
		id: 3,
		name: 'Mock Bar & Grill',
		vicinity: '789 Lounge Lane, Pubtown',
	},
	{
		id: 4,
		name: 'XXX Restaurant',
		vicinity: '123 Mock Street, Mocksville',
	},
	{
		id: 5,
		name: 'YYY Bar',
		vicinity: '456 Java Avenue, Brewville',
	},
	{
		id: 6,
		name: 'ZZZ Cafe',
		vicinity: '789 Lounge Lane, Pubtown',
	},
];

/**
 * locations will be null when location services are disabled
 * locations will be an empty array if nothing was found nearby
 * locations will otherwise be an array of places
 * autocompleteLocations is separate and should work regardless of location services
 */
export default function NearbyLocations({ locations, isOpen, onClose }) {
	const [isManual, setIsManual] = useState(false);
	const [suggestions, setSuggestions] = useState(locations || []);
	const [searchTerm, setSearchTerm] = useState('');
	const [vicinity, setVicinity] = useState('');
	const [searchTimeout, setSearchTimeout] = useState(null);

	const handleLocationClick = (location) => {
		onClose(location);
	};

	const handleManualLocationSave = () => {
		onClose({ name: searchTerm, vicinity: vicinity || 'Not Provided', manual: true });
	};

	const handleSearchChange = async (e) => {
		const newText = e.target.value;
		setSearchTerm(newText);
		if (!isManual) {
			// Debounce using timeout
			clearTimeout(searchTimeout);
			setSearchTimeout(
				setTimeout(async () => {
					const results = await autocompletePlaces(newText);
					setSuggestions(
						results.map((prediction) => ({
							...prediction,
							name: prediction.structured_formatting.main_text,
							vicinity: prediction.structured_formatting.secondary_text,
						}))
					);
				}, 500)
			);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} closeText='Cancel'>
			<Button mt='-1rem' fullWidth transparent onClick={() => setIsManual(!isManual)}>
				{isManual ? 'Show Suggestions' : 'Disable Suggestions'}
			</Button>

			<Input
				type='text'
				placeholder={
					isManual
						? 'Enter establishment name...'
						: suggestions.length
						? 'Search locations...'
						: 'Type to populate suggestions...'
				}
				value={searchTerm}
				onChange={handleSearchChange}
			/>

			{isManual && (
				<Input
					type='text'
					placeholder='Address or City, State (optional)'
					value={vicinity}
					onChange={(e) => setVicinity(e.target.value)}
					mt='1rem'
				/>
			)}

			{isManual && (
				<Button onClick={handleManualLocationSave} mt='1rem' disabled={!searchTerm} fullWidth>
					Save
				</Button>
			)}

			{!isManual && suggestions && suggestions.length !== 0 && (
				<ModalContainer>
					<DarkModeList>
						{suggestions.map((location) => (
							<LocationItem key={location.id} onClick={() => handleLocationClick(location)}>
								<LocationName>{location.name}</LocationName>
								<p>{location.vicinity}</p>
							</LocationItem>
						))}
					</DarkModeList>
				</ModalContainer>
			)}
		</Modal>
	);
}
