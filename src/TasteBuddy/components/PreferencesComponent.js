import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { PreferencesContext } from './PreferencesProvider';
import Modal from './Modal';
import preferenceOptions from '../preference-options';
import { Dropdown, Input, Option, Paragraph, WhiteButton, Button } from '../styles';

const PreferencesContainer = styled.div`
	width: 100%;
	margin-top: ${({ $condensed }) => ($condensed ? '0' : '1rem')};
`;

const SectionHeader = styled.h2`
	color: white;
	font-size: 1.5rem;
	margin-bottom: 10px;
	margin-top: 0;
`;

const Section = styled.div`
	box-sizing: border-box;
	width: 100%;
	background-color: #333;
	border-radius: 8px;
	padding: ${({ $condensed }) => ($condensed ? '1rem 0' : '1rem')};
	margin-bottom: ${({ $condensed }) => ($condensed ? '0' : '20px')};
`;

const ItemList = styled.ul`
	list-style: none;
	padding: 0;
	margin-top: 0;
`;

const Item = styled.li`
	padding: 10px;
	border-bottom: ${({ isLast }) => (isLast ? 'none' : '1px solid #555')};
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: ${({ isSelected }) => (isSelected ? '#999' : 'initial')};
	&::after {
		content: ${({ isSelected }) => (isSelected ? '"\\2713"' : 'none')};
		padding-right: 5px;
	}
`;

const AddMoreButton = styled.button`
	width: 100%;
	text-align: center;
	padding: 10px 0;
	background: none;
	border: none;
	color: white;
	font-size: 1rem;
	cursor: pointer;
`;

const CustomOptionButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	font-size: 1rem;
	color: white;
	padding: 10px 0 0 10px;
`;

const StyledLabel = styled.label`
	display: flex;
	align-items: center;
	margin: 10px 0;
	color: #ffffff; /* Text color for dark theme */
	font-size: 14px;
`;

// Define the styles for the checkbox input
const StyledCheckbox = styled.input`
	margin-right: 10px;
	width: 20px; /* Adjust the width for a bigger checkbox */
	height: 20px; /* Adjust the height for a bigger checkbox */
	background-color: #333; /* Background color for dark theme */
`;

const createEditPreferencesMap = (preferences) => {
	const categories = Object.keys(preferences);
	const optionMap = preferenceOptions.reduce((map, option) => {
		return { ...map, [option]: false };
	}, {});
	return categories.reduce((categoryMap, category) => {
		const categorySelectionMap = preferences[category].reduce((selectionMap, selection) => {
			return { ...selectionMap, [selection]: true };
		}, optionMap);
		return { ...categoryMap, [category]: categorySelectionMap };
	}, {});
};

/**
 * @param {boolean} condensed removes margin/padding for condensed view
 */
export default function PreferencesComponent({ condensed }) {
	const { preferences, updatePreferences } = useContext(PreferencesContext);
	const [selectedCategory, setSelectedCategory] = useState('');
	const [editPreferencesMap, setEditPreferencesMap] = useState(createEditPreferencesMap(preferences));
	const [searchText, setSearchText] = useState('');
	const [onlySelected, setOnlySelected] = useState(false);

	useEffect(() => {
		// ToDo - handle better
		setEditPreferencesMap(createEditPreferencesMap(preferences));
	}, [preferences]);

	const currentCategoryOptions = editPreferencesMap[selectedCategory];

	const handleItemClick = (item) => {
		const updatedCategorySelections = { ...currentCategoryOptions, [item]: !currentCategoryOptions[item] };
		setEditPreferencesMap({ ...editPreferencesMap, [selectedCategory]: updatedCategorySelections });
		setSearchText('');
	};

	const handleCloseEditMode = () => {
		const categories = Object.keys(preferences);
		const updatedPreferences = categories.reduce((map, category) => {
			const categoryOptionMap = editPreferencesMap[category];
			const categorySelections = Object.keys(categoryOptionMap).filter((option) => categoryOptionMap[option]);
			return { ...map, [category]: categorySelections };
		}, {});
		updatePreferences(updatedPreferences);
		setSearchText('');
		setSelectedCategory('');
	};

	const applySearchFilter = (item) => item.toLowerCase().includes(searchText.toLowerCase());

	const searchHasExactMatch = !searchText || (searchText && currentCategoryOptions[searchText.toLowerCase()]);
	const applySelectionFilter = (item) => {
		if (!onlySelected) {
			return true; // Show all items when checkbox is not checked
		}
		return currentCategoryOptions[item]; // Show only selected items when checkbox is checked
	};

	const sections = [
		{ name: 'Allergies', propertyName: 'allergies', data: preferences.allergies },
		{ name: 'Likes', propertyName: 'likes', data: preferences.likes },
		{ name: 'Dislikes', propertyName: 'dislikes', data: preferences.dislikes },
	];

	return (
		<PreferencesContainer $condensed={condensed}>
			<Modal isOpen={selectedCategory} header='Preferences' onClose={handleCloseEditMode} closeText='Save'>
				<Dropdown value={selectedCategory} onChange={({ target }) => setSelectedCategory(target.value)}>
					{sections.map(({ name, propertyName }) => (
						<Option value={propertyName}>{name}</Option>
					))}
				</Dropdown>

				<Input
					type='text'
					placeholder='Search items or add custom value...'
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					mt='1rem'
				/>

				<StyledLabel>
					<StyledCheckbox type='checkbox' checked={onlySelected} onChange={() => setOnlySelected(!onlySelected)} />
					Show only selected items
				</StyledLabel>

				{currentCategoryOptions && (
					<ItemList>
						{Object.keys(currentCategoryOptions)
							.filter(applySearchFilter)
							.filter(applySelectionFilter)
							.map((item) => (
								<Item onClick={() => handleItemClick(item)} isSelected={currentCategoryOptions[item]}>
									{item}
								</Item>
							))}
					</ItemList>
				)}

				{!searchHasExactMatch && (
					<div>
						<Paragraph mb='1rem'>
							TasteBuddy provides some basic options but click the button below to add a custom value.
						</Paragraph>
						<Button fullWidth onClick={() => handleItemClick(searchText.toLowerCase())}>
							+ Add {searchText}
						</Button>
					</div>
				)}
			</Modal>

			<WhiteButton fullWidth onClick={() => setSelectedCategory('allergies')} mb={condensed ? '' : '1rem'}>
				Edit Selections
			</WhiteButton>

			{sections.map(({ name, data }) => (
				<Section $condensed={condensed}>
					<SectionHeader>{name}</SectionHeader>
					{data.length ? data.join(', ') : 'Nothing selected'}
				</Section>
			))}
		</PreferencesContainer>
	);
}
