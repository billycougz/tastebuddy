import React, { useState } from 'react';
import styled from 'styled-components';
import { searchMenu } from '../../api';
import LoadingComponent from '../../components/LoadingComponent';
import { PageContainer, TextArea, Button, Dropdown, Option, ErrorText, WhiteButton } from '../../styles';
import { isDevelopment } from '../../utils';
import { getPreferences } from '../../localStorage';

const DetailText = styled.p`
	text-align: ${({ align }) => align || 'initial'};
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

const categories = ['Breakfast', 'Lunch', 'Brunch', 'Appetizer/Snack', 'Dinner', 'Dessert', 'Drinks'];

export default function MoodSelectionComponent({
	onSearchError,
	onSearchResults,
	processedMenuIds,
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
		try {
			const response = await searchMenu({
				category: selectedCategory,
				menuIds: processedMenuIds,
				mood: moodInputValue,
				preferences: getPreferences(), // Keep an eye on this
			});
			if (response.error) {
				onSearchError(response.error);
			} else {
				response.menuIds = processedMenuIds;
				onSearchResults(response);
			}
		} catch (e) {
			onSearchError(e.message);
		}

		setIsLoading(false);
	};

	const handleMockSearch = () => {
		onSearchResults({
			message: 'Here is a massive list of options:',
			menuIds: processedMenuIds,
			results: [
				{
					name: 'Beef Wellington',
					description:
						'A steak dish of English origin, made out of fillet steak coated with pâté and duxelles, wrapped in puff pastry, then baked.',
					reason: 'You love Beef Wellington!',
				},
			],
		});
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
				placeholder='What are you in the mood for? Leave this blank to search using preferences only.'
				value={moodInputValue}
				onChange={(e) => setMoodInputValue(e.target.value)}
			/>
			<WhiteButton fullWidth $disabledStyle={!selectedCategory} onClick={handleSearch}>
				{moodInputValue ? 'Search Menu' : 'Surprise Me'}
			</WhiteButton>
			{isDevelopment() && <Button onClick={handleMockSearch}>Mock Search</Button>}
			<DetailText align='center'>
				Regardless of your mood, TasteBuddy always considers your{' '}
				<button onClick={() => setShowPreferences(true)}>preferences</button>.
			</DetailText>
		</PageContainer>
	);
}
