import React, { useEffect, useState } from 'react';
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
	const [stillUploadingTimeout, setStillUploadingTimeout] = useState(null); // Used when user searches before menu uploaded
	const [loadingMsg, setLoadingMsg] = useState('');

	useEffect(() => {
		if (processedMenuIds && isLoading) {
			// ToDo: Handle better
			runSearch();
			stillUploadingTimeout.forEach(clearTimeout);
			setStillUploadingTimeout(null);
		}
	}, [processedMenuIds]);

	const handleSearch = async (e) => {
		setErrors({});
		if (!selectedCategory) {
			setErrors({ category: true });
			return;
		}
		setIsLoading(true);
		if (processedMenuIds) {
			await runSearch();
		} else {
			// ToDo: Handle better
			const firstTimeout = setTimeout(() => {
				setLoadingMsg(`TasteBuddy is taking longer than normal. This usually happens when you have a poor connection.`);
			}, 20000); // Show error after one minute
			const secondTimeout = setTimeout(() => {
				setIsLoading(false);
				setLoadingMsg('');
				setErrors({ timeout: true });
				setStillUploadingTimeout(null);
			}, 60000);
			setStillUploadingTimeout([firstTimeout, secondTimeout]);
		}
	};

	const runSearch = async () => {
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
		return <LoadingComponent loadingMsg={loadingMsg} />;
	}

	return (
		<PageContainer vCenter hCenter>
			{errors.timeout && (
				<ErrorText>
					TasteBuddy had trouble processing your menu. You can try again or start over with a new image. Try using Wi-Fi
					when available.
				</ErrorText>
			)}
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
