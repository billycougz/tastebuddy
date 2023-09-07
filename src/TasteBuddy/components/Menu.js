import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import FeedbackModal from './FeedbackModal';
import ManageData from './ManageData';
import { isDevelopment } from '../utils';
import Modal from './Modal';
import UserProfile from './UserProfile';

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

function shareCurrentPage() {
	if (navigator.share) {
		navigator
			.share({
				title: document.title,
				url: appendQueryParam(window.location.href, 'share', 'true'),
			})
			.then(() => console.log('Sharing succeeded'))
			.catch((error) => {
				console.error('Error sharing:', error);
				copyUrlToClipboard();
			});
	} else {
		copyUrlToClipboard();
	}
}

function appendQueryParam(url, key, value) {
	const separator = url.includes('?') ? '&' : '?';
	return `${url}${separator}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
}

function copyUrlToClipboard() {
	const url = appendQueryParam(window.location.href, 'share', 'true');

	// Create a temporary input element
	const input = document.createElement('input');
	input.style.position = 'fixed';
	input.style.opacity = 0;
	input.value = url;
	document.body.appendChild(input);

	// Select the input and copy the value to clipboard
	input.select();
	document.execCommand('copy');
	document.body.removeChild(input);

	alert('TasteBuddy URL has been copied to clipboard.');
}

export default function Menu({ view, onViewChange, onShowPreferences }) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);
	const [showManageStorageModal, setShowManageStorageModal] = useState(false);
	const [showContactModal, setShowContactModal] = useState(false);

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
		if (typeof window !== 'undefined') {
			window.addEventListener('click', handleOutsideClick);

			return () => {
				window.removeEventListener('click', handleOutsideClick);
			};
		}
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
			label: 'Manage your preferences',
			onClick: () => {
				onShowPreferences(true);
				closeDropdown();
			},
		},
		{
			label: 'Manage your contact info',
			onClick: () => setShowContactModal(true),
		},
		{
			label: 'Provide feedback',
			onClick: () => setShowFeedbackModal(true),
		},
		{
			label: 'Share TasteBuddy',
			onClick: shareCurrentPage,
		},
	];

	if (isDevelopment()) {
		menuItems.push({
			label: 'Manage storage',
			onClick: () => setShowManageStorageModal(true),
		});
	}

	return (
		<DropdownContainer ref={dropdownRef}>
			{showManageStorageModal && <ManageData onClose={() => setShowManageStorageModal(false)} />}
			{showFeedbackModal && <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />}
			{showContactModal && (
				<Modal isOpen={true} onClose={() => setShowContactModal(false)} closeText='Save'>
					<UserProfile />
				</Modal>
			)}
			<DropdownButton onClick={toggleDropdown}>...</DropdownButton>
			<DropdownMenu isOpen={isDropdownOpen}>
				{menuItems
					.filter(({ showIf }) => !showIf || showIf.includes(view))
					.map((item, index, filteredItems) => (
						<DropdownMenuItem key={index} isLast={index === filteredItems.length - 1} onClick={item.onClick}>
							{item.label}
						</DropdownMenuItem>
					))}
			</DropdownMenu>
		</DropdownContainer>
	);
}
