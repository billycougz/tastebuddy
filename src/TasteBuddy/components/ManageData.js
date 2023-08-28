import React, { useState } from 'react';
import { MdSportsGolf } from 'react-icons/md';
import styled from 'styled-components';
import Modal from './Modal';

const Container = styled.div`
	background-color: #333;
	color: white;
	padding: 20px;
`;

const Header = styled.h1`
	font-size: 24px;
`;

const Button = styled.button`
	background-color: #555;
	color: white;
	border: none;
	padding: 8px 16px;
	margin-right: 10px;
	cursor: pointer;

	&:hover {
		background-color: #777;
	}
`;

const TextArea = styled.textarea`
	width: 100%;
	height: 100px;
	margin: 10px 0;
`;

const ManageData = ({ onClose }) => {
	const [statusMsg, setStatusMsg] = useState('');
	const [textAreaValue, setTextAreaValue] = useState('');

	const handleCopyStorage = () => {
		try {
			const localStorageData = { ...localStorage };
			const formattedData = JSON.stringify(localStorageData, null, 2);

			// Create a temporary text area
			const tempTextArea = document.createElement('textarea');
			tempTextArea.value = formattedData;
			document.body.appendChild(tempTextArea);
			tempTextArea.select();

			// Copy the data to the clipboard
			document.execCommand('copy');

			// Remove the temporary text area
			document.body.removeChild(tempTextArea);

			const numKeys = Object.keys(localStorageData).length;
			const msg = `Copied ${numKeys} items from storage.`;
			setStatusMsg(msg);
		} catch (e) {
			setStatusMsg('There was an error copying your storage data.');
		}
	};

	const handleUpdateStorage = () => {
		if (!textAreaValue) {
			setStatusMsg('You need to paste a storage object to load.');
			return;
		}
		if (window.confirm('Are you sure you want to update your storage data? Existing items will be overwritten.')) {
			try {
				const parsedData = JSON.parse(textAreaValue);
				for (const key in parsedData) {
					if (parsedData.hasOwnProperty(key)) {
						localStorage.setItem(key, parsedData[key]);
					}
				}
				const numKeys = Object.keys(parsedData).length;
				setStatusMsg(`Saved ${numKeys} items into storage.`);
				setTextAreaValue('');
			} catch (error) {
				setStatusMsg('There was an error updating your storage data.');
			}
		}
	};

	const handleTextAreaChange = (e) => {
		setStatusMsg('');
		setTextAreaValue(e.target.value);
	};

	return (
		<Modal isOpen={true} onClose={onClose}>
			<Header>Manage Data</Header>
			<p>Copy storage data from one browser or environment and load it into another.</p>
			<Button onClick={handleCopyStorage}>Copy Storage</Button>
			<Button onClick={handleUpdateStorage}>Load Storage</Button>
			<TextArea placeholder='Paste your copied storage data...' value={textAreaValue} onChange={handleTextAreaChange} />
			<pre>{statusMsg}</pre>
		</Modal>
	);
};

export default ManageData;
