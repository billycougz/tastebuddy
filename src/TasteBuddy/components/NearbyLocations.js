import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import { Input, Paragraph, Button } from '../styles';

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

export default function NearbyLocations({ locations, isOpen, onClose }) {
	// const locations = mockLocations;
	const [searchTerm, setSearchTerm] = useState('');
	const [vicinity, setVicinity] = useState('');
	const [isManual, setIsManual] = useState(!Boolean(locations?.length));

	useEffect(() => {
		// Account for race condition between user and locations loaded
		setIsManual(!Boolean(locations?.length));
	}, [locations]);

	const filteredLocations = locations?.filter((location) =>
		location.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleLocationClick = (location) => {
		onClose(location);
	};

	const handleManualLocationSave = () => {
		onClose({ name: searchTerm, vicinity: vicinity || 'Not Provided', manual: true });
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} closeText='Cancel'>
			{!Boolean(locations?.length) && (
				<ModalContainer>
					{locations === null && (
						<Paragraph>Your Location Services are disabled. Please enter the restaurant name manually.</Paragraph>
					)}
					{locations?.length === 0 && (
						<Paragraph>
							TasteBuddy didn't find any nearby establishments. Please enter the restaurant name manually.
						</Paragraph>
					)}
				</ModalContainer>
			)}

			{Boolean(locations?.length) && (
				<Button mt='-1rem' fullWidth transparent onClick={() => setIsManual(!isManual)}>
					{isManual ? 'Show Nearby Locations' : 'Manually Enter Location'}
				</Button>
			)}

			<Input
				type='text'
				placeholder={isManual ? 'Enter establishment name' : 'Search locations'}
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
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

			{!isManual && (
				<ModalContainer>
					<DarkModeList>
						{filteredLocations.map((location) => (
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
