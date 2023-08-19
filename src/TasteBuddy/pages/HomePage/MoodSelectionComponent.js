import React, { useState } from 'react';
import styled from 'styled-components';
import { searchMenu } from '../../api';
import LoadingComponent from '../../components/LoadingComponent';
import { PageContainer, TextArea, Button, Dropdown, Option } from '../../styles';

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

const menuTypes = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drinks'];

export default function MoodSelectionComponent({
	onSearchError,
	onSearchResults,
	processedMenuIds,
	preferences,
	setShowPreferences,
}) {
	const [menuType, setMenuType] = useState('');
	const [moodInputValue, setMoodInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSearch = async (e) => {
		setIsLoading(true);
		const response = await searchMenu({ menuType, menuIds: processedMenuIds, moodInputValue, preferences });
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
			<Dropdown $placeholder={!Boolean(menuType)} onChange={(e) => setMenuType(e.target.value)} value={menuType}>
				<Option value=''>What are we looking for?</Option>
				{menuTypes.map((type) => (
					<Option>{type}</Option>
				))}
			</Dropdown>
			<TextArea
				placeholder='Are you in the mood for anything?'
				value={moodInputValue}
				onChange={(e) => setMoodInputValue(e.target.value)}
			/>
			<Button disabled={!menuType} onClick={handleSearch}>
				{moodInputValue ? 'Search' : 'Surprise Me'}
			</Button>
			<DetailText>
				TasteBuddy always considers your <button onClick={() => setShowPreferences(true)}>preferences</button>.
			</DetailText>
		</PageContainer>
	);
}
