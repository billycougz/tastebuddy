import React, { useState } from 'react';
import styled from 'styled-components';
import { getPreferences, savePreferences } from '../localStorage';
import Modal from './Modal';
import preferenceOptions from '../preference-options';
import { Input } from '../styles';

const PreferencesContainer = styled.div`
	width: 100%;
`;

const SectionHeader = styled.h2`
	color: white;
	font-size: 1.5rem;
	margin-bottom: 10px;
`;

const Section = styled.div`
	box-sizing: border-box;
	width: 100%;
	background-color: #333;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	padding: 10px 10px 0px 10px;
	margin-bottom: 20px;
`;

const ItemList = styled.ul`
	list-style: none;
	padding: 0;
	margin-top: 0;
`;

const Item = styled.li`
	padding: 5px 0;
	border-bottom: ${({ isLast }) => (isLast ? 'none' : '1px solid #555')};
	display: flex;
	justify-content: space-between;
	align-items: center;

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
	margin-top: 10px;
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

export default function PreferencesComponent({ onUpdate }) {
	const [preferences, setPreferences] = useState(getPreferences());
	const [{ category, selectionMap }, setEditCategorySelections] = useState({});
	const [searchText, setSearchText] = useState('');
	const [onlySelected, setOnlySelected] = useState(false);

	const flatPreferences = Object.keys(selectionMap || {}).map((item) => item);
	const preferenceOptionMap = [...preferenceOptions, ...flatPreferences].reduce(
		(map, option) => ({ ...map, [option.toLowerCase()]: true }),
		{}
	);

	const allPreferenceOptions = Object.keys(preferenceOptionMap).sort();

	const handleAddMoreClick = (category) => {
		const selections = preferences[category];
		const selectionMap = selections.reduce((map, item) => ({ ...map, [item]: true }), {});
		setEditCategorySelections({
			category,
			selectionMap,
		});
	};

	const handleItemClick = (item) => {
		const isSelected = !selectionMap[item];
		setEditCategorySelections({ category, selectionMap: { ...selectionMap, [item]: isSelected } });
		setSearchText('');
	};

	const handleAddSearchClick = () => {
		const item = searchText.toLowerCase();
		setEditCategorySelections({ category, selectionMap: { ...selectionMap, [item]: true } });
		setSearchText('');
	};

	const handleCloseEditMode = () => {
		const selections = Object.entries(selectionMap)
			.filter(([item, isSelected]) => isSelected)
			.map(([item]) => item);
		const updatedPreferences = { ...preferences, [category]: selections };
		savePreferences(updatedPreferences);
		onUpdate(updatedPreferences);
		setPreferences(updatedPreferences);
		setSearchText('');
		setEditCategorySelections({});
	};

	const applySearchFilter = (item) => item.toLowerCase().includes(searchText.toLowerCase());

	const searchHasExactMatch = !searchText || (searchText && preferenceOptionMap[searchText.toLowerCase()]);
	const applySelectionFilter = (item) => {
		if (!onlySelected) {
			return true; // Show all items when checkbox is not checked
		}
		return selectionMap[item]; // Show only selected items when checkbox is checked
	};

	return (
		<PreferencesContainer>
			<Modal isOpen={category} header={`Select your ${category}`} onClose={handleCloseEditMode} closeText='Save'>
				<Input
					type='text'
					placeholder='Search items or add new...'
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
				/>
				{!searchHasExactMatch && (
					<CustomOptionButton onClick={handleAddSearchClick}>+ Add {searchText}</CustomOptionButton>
				)}

				<StyledLabel>
					<StyledCheckbox type='checkbox' checked={onlySelected} onChange={() => setOnlySelected(!onlySelected)} />
					Show only selected items
				</StyledLabel>

				{selectionMap && (
					<ItemList>
						{allPreferenceOptions
							.filter(applySearchFilter)
							.filter(applySelectionFilter)
							.map((item) => (
								<Item onClick={() => handleItemClick(item)} isSelected={selectionMap[item]}>
									{item}
								</Item>
							))}
					</ItemList>
				)}
			</Modal>

			<Section>
				<SectionHeader>Allergies</SectionHeader>
				<ItemList>
					{preferences.allergies.map((item) => (
						<Item>{item}</Item>
					))}
					<AddMoreButton onClick={() => handleAddMoreClick('allergies')}>Edit Items</AddMoreButton>
				</ItemList>
			</Section>

			<Section>
				<SectionHeader>Likes</SectionHeader>
				<ItemList>
					{preferences.likes.map((item) => (
						<Item>{item}</Item>
					))}
					<AddMoreButton onClick={() => handleAddMoreClick('likes')}>Edit Items</AddMoreButton>
				</ItemList>
			</Section>

			<Section>
				<SectionHeader>Dislikes</SectionHeader>
				<ItemList>
					{preferences.dislikes.map((item) => (
						<Item>{item}</Item>
					))}
					<AddMoreButton onClick={() => handleAddMoreClick('dislikes')}>Edit Items</AddMoreButton>
				</ItemList>
			</Section>
		</PreferencesContainer>
	);
}
