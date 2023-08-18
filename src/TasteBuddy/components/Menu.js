import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const DropdownContainer = styled.div`
	position: fixed;
	top: 10px;
	right: 10px;
	z-index: 999;
`;

const DropdownButton = styled.button`
	background: none;
	border: none;
	color: white;
	font-size: 1.5rem;
	cursor: pointer;
	float: right;
	background-color: #333;
	border-radius: 8px;
	line-height: 20px;
	padding-bottom: 12px;
`;

const DropdownMenu = styled.ul`
	list-style: none;
	background-color: #333;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	padding: 0;
	margin: 40px 0 0 0;
	display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const DropdownMenuItem = styled.li`
	position: relative;
	padding: 10px;
	cursor: pointer;
	border-bottom: ${({ isLast }) => (isLast ? 'none' : '1px solid #555')};
	&:hover {
		background-color: #333;
	}
`;

export default function Menu({ view, onViewChange, onShowPreferences }) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	const toggleDropdown = () => {
		setIsDropdownOpen((prevOpen) => !prevOpen);
	};

	const closeDropdown = () => {
		setIsDropdownOpen(false);
	};

	const handleOutsideClick = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			closeDropdown();
		}
	};

	useEffect(() => {
		window.addEventListener('click', handleOutsideClick);

		return () => {
			window.removeEventListener('click', handleOutsideClick);
		};
	}, []);

	const menuItems = [
		{
			label: 'Select a new menu',
			showIf: ['preference-selection', 'mood-selection', 'result-selection'],
			onClick: () => {
				onViewChange('menu-selection');
				closeDropdown();
			},
		},
		{
			label: 'Change your mood',
			showIf: ['result-selection'],
			onClick: () => {
				onViewChange('mood-selection');
				closeDropdown();
			},
		},
		{
			label: 'View or change your preferences',
			showIf: ['menu-selection', 'mood-selection', 'result-selection'],
			onClick: () => {
				onShowPreferences(true);
				closeDropdown();
			},
		},
	];

	return (
		<DropdownContainer ref={dropdownRef}>
			<DropdownButton onClick={toggleDropdown}>...</DropdownButton>
			<DropdownMenu isOpen={isDropdownOpen}>
				{menuItems
					.filter(({ showIf }) => showIf.includes(view))
					.map((item, index, filteredItems) => (
						<DropdownMenuItem key={index} isLast={index === filteredItems.length - 1} onClick={item.onClick}>
							{item.label}
						</DropdownMenuItem>
					))}
			</DropdownMenu>
		</DropdownContainer>
	);
}
