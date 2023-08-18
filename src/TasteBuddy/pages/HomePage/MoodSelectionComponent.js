import React, { useState } from 'react';
import styled from 'styled-components';
import { searchMenu } from '../../api';
import LoadingComponent from '../../components/LoadingComponent';
import { PageContainer, TextArea, Button } from '../../styles';

const DetailText = styled.p`
	margin: 0;
	font-size: 0.875rem;
	> button {
		font-size: 1rem;
		background: none;
		border: none;
		color: red;
		padding: 0;
	}
`;

export default function MoodSelectionComponent({
	onSearchError,
	onSearchResults,
	processedMenuIds,
	preferences,
	setShowPreferences,
}) {
	const [moodInputValue, setMoodInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSearch = async (e) => {
		setIsLoading(true);
		const response = await searchMenu(processedMenuIds, moodInputValue, preferences);
		if (response.error) {
			onSearchError(response.error);
		} else {
			response.menuIds = processedMenuIds;
			onSearchResults(response);
		}
		setIsLoading(false);
	};

	if (isLoading) {
		return <LoadingComponent />;
	}

	return (
		<PageContainer vCenter hCenter>
			<TextArea
				placeholder='What are you in the mood for?'
				value={moodInputValue}
				onChange={(e) => setMoodInputValue(e.target.value)}
			/>
			<Button onClick={handleSearch}>{moodInputValue ? 'Search' : 'Surprise Me'}</Button>
			<DetailText>
				TasteBuddy always considers your <button onClick={() => setShowPreferences(true)}>preferences</button>.
			</DetailText>
		</PageContainer>
	);
}
