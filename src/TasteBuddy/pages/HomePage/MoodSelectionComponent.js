import React, { useState } from 'react';
import styled from 'styled-components';
import { searchMenu } from '../../api';
import LoadingComponent from '../../components/LoadingComponent';
import { PageContainer, TextArea, Button, Dropdown, Option, ErrorText } from '../../styles';

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

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drinks'];

export default function MoodSelectionComponent({
	onSearchError,
	onSearchResults,
	processedMenuIds,
	preferences,
	setShowPreferences,
}) {
	const [selectedCategory, setSelectedCategory] = useState('');
	const [moodInputValue, setMoodInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const handleSearch = async (e) => {
		if (!selectedCategory) {
			setErrors({ category: true });
			return;
		}
		setIsLoading(true);
		const response = await searchMenu({
			category: selectedCategory,
			menuIds: processedMenuIds,
			moodInputValue,
			preferences,
		});
		if (response.error) {
			onSearchError(response.error);
		} else {
			response.menuIds = processedMenuIds;
			onSearchResults(response);
		}
		setIsLoading(false);
	};

	const handleCategoryChange = (e) => {
		setErrors({});
		setSelectedCategory(e.target.value);
	};

	if (isLoading) {
		return <LoadingComponent />;
	}

	return (
		<PageContainer vCenter hCenter>
			<Dropdown $placeholder={!Boolean(selectedCategory)} onChange={handleCategoryChange} value={selectedCategory}>
				<Option value=''>What are we ordering?</Option>
				{categories.map((type) => (
					<Option>{type}</Option>
				))}
			</Dropdown>
			{errors.category && <ErrorText>Please select a category before searching.</ErrorText>}
			<TextArea
				placeholder='Are you in the mood for anything?'
				value={moodInputValue}
				onChange={(e) => setMoodInputValue(e.target.value)}
			/>
			<Button $disabledStyle={!selectedCategory} onClick={handleSearch}>
				{moodInputValue ? 'Search Menu' : 'Surprise Me'}
			</Button>
			<DetailText>
				TasteBuddy always considers your <button onClick={() => setShowPreferences(true)}>preferences</button>.
			</DetailText>
		</PageContainer>
	);
}
