import React, { useState } from 'react';
import styled from 'styled-components';
import { Heading2, Paragraph } from '../styles';

const ModalBackdrop = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
`;

const ModalContent = styled.div`
	background-color: #333;
	color: white;
	padding: 20px;
	border-radius: 5px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
	background-color: #666;
	color: white;
	border: none;
	padding: 10px 15px;
	border-radius: 3px;
	cursor: pointer;
	margin-top: 10px;
	align-self: flex-end;
`;

const CheckboxLabel = styled.label`
	display: flex;
	align-items: center;
	margin-top: 10px;
`;

const CheckboxInput = styled.input`
	margin-right: 5px;
`;

function DesktopContent() {
	return (
		<div>
			<Heading2>Welcome to TasteBuddy!</Heading2>
			<Paragraph>It appears you are using a desktop (non-mobile) device.</Paragraph>
			<Paragraph>
				While TasteBuddy should be fully functional on desktop devices, it is designed for mobile and the desktop
				experience will likely look and feel subpar.
			</Paragraph>
		</div>
	);
}

function MobileContent() {
	return (
		<div>
			<Heading2>Welcome to TasteBuddy!</Heading2>
			<Paragraph>
				TasteBuddy supports all browsers but Safari is not recommended. For the best experience, add TasteBuddy to your
				Home Screen:
			</Paragraph>
			<ol>
				<li>Tap the browser's 'Share' button</li>
				<li>Select 'Add to Home Screen'</li>
				<li>Follow the prompts</li>
			</ol>
			<Paragraph>You will then have a TasteBuddy icon on your Home Screen as you do with any other app.</Paragraph>
		</div>
	);
}

function LocationContent() {
	return (
		<div>
			<Heading2>Restaurant Name</Heading2>
			<Paragraph>
				TasteBuddy can use your location to auto-populate the name of the restaurant or establishment.
			</Paragraph>
			<Paragraph>
				To enable this, select "Allow" in the prompt that follows. Otherwise, you can manually enter the name.
			</Paragraph>
		</div>
	);
}

const AlertModal = ({ type, onClose, hideDisable }) => {
	const [disableAlert, setDisableAlert] = useState(false);

	const handleClose = () => {
		if (disableAlert) {
			localStorage.setItem(`tastebuddy-${type}-alert-disabled`, 'true');
		}
		onClose();
	};

	return (
		<ModalBackdrop>
			<ModalContent>
				{type === 'mobile' && <MobileContent />}
				{type === 'desktop' && <DesktopContent />}
				{type === 'location' && <LocationContent />}

				{!hideDisable && (
					<CheckboxLabel>
						<CheckboxInput type='checkbox' checked={disableAlert} onChange={() => setDisableAlert(!disableAlert)} />
						Don't show this again
					</CheckboxLabel>
				)}

				<CloseButton onClick={handleClose}>OK</CloseButton>
			</ModalContent>
		</ModalBackdrop>
	);
};

export default AlertModal;
