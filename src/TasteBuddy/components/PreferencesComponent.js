import React, { useState } from 'react';
import styled from 'styled-components';
import { getPreferences, savePreferences } from '../localStorage';
import Modal from './Modal';
import preferenceOptions from '../preference-options';
import { Dropdown, Input, Option, Paragraph, WhiteButton } from '../styles';

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

export default function PreferencesComponent({ onUpdate, condensed }) {
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

	const sections = [
		{ name: 'Allergies', propertyName: 'allergies', data: preferences.allergies },
		{ name: 'Likes', propertyName: 'likes', data: preferences.likes },
		{ name: 'Dislikes', propertyName: 'dislikes', data: preferences.dislikes },
	];

	return (
		<PreferencesContainer $condensed={condensed}>
			<Modal isOpen={category} header='Preferences' onClose={handleCloseEditMode} closeText='Save'>
				<Dropdown value={category} onChange={({ target }) => handleAddMoreClick(target.value)}>
					{sections.map(({ name, propertyName }) => (
						<Option value={propertyName}>{name}</Option>
					))}
				</Dropdown>

				<Input
					type='text'
					placeholder='Search items or add new...'
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					mt='1rem'
				/>

				{!searchHasExactMatch && (
					<div>
						<Paragraph mb='1rem'>
							TasteBuddy provides some basic options but please add anything that's missing.
						</Paragraph>
						<WhiteButton fullWidth onClick={handleAddSearchClick}>
							+ Add {searchText}
						</WhiteButton>
					</div>
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

			<WhiteButton fullWidth onClick={() => handleAddMoreClick('allergies')} mb={condensed ? '' : '1rem'}>
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
