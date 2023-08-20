import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Heading2, Paragraph } from '../styles';
import localStorage from '../localStorage';
import { isMobile } from '../utils';
import PreferencesComponent from './PreferencesComponent';

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

const ButtonContainer = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 1rem;
`;

const AlertButton = styled(Button)`
	background-color: #666;
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
			<Heading2>TasteBuddy Desktop</Heading2>
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
			<Heading2>TasteBuddy Browsers</Heading2>
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

function IntroContent() {
	return (
		<div>
			<Heading2>Welcome to TasteBuddy!</Heading2>
			<Paragraph>TasteBuddy is your AI companion for food & drink recommendations.</Paragraph>
			<Paragraph>
				When at a restaurant, bar, or anywhere that sells food or drinks, simply take a photo of the menu, tell
				TasteBuddy what you're in to mood for, and TasteBuddy will take care of the rest!
			</Paragraph>
		</div>
	);
}

function BrowserContent() {
	return isMobile() ? <MobileContent /> : <DesktopContent />;
}

function PreferenceContent() {
	return (
		<div>
			<Heading2>Preferences</Heading2>
			<Paragraph>Help TasteBuddy understand your preferences.</Paragraph>
			<Paragraph>TasteBuddy pre-populates a variety of options, but add anything you please.</Paragraph>
			<PreferencesComponent onUpdate={() => null} />
		</div>
	);
}

function IntroEndContent() {
	return (
		<div>
			<Heading2>Good To Go!</Heading2>
			<Paragraph>You're ready to give TasteBuddy your first menu!</Paragraph>
		</div>
	);
}

const newUserSegments = [IntroContent, BrowserContent, PreferenceContent, IntroEndContent];

const AlertModal = ({ type, onClose, hideDisable }) => {
	const [disableAlert, setDisableAlert] = useState(false);
	const [segmentIndex, setSegmentIndex] = useState(0);

	const handleClose = () => {
		if (disableAlert) {
			localStorage.setItem(`tastebuddy-${type}-alert-disabled`, 'true');
		}
		onClose();
	};

	const showBack = Boolean(type === 'newUser' && segmentIndex);
	const showNext = Boolean(type === 'newUser' && segmentIndex !== newUserSegments.length - 1);
	const showDisableCheckbox = !hideDisable && (type === 'newUser' ? !showNext : true);

	const NewUserContent = newUserSegments[segmentIndex];
	return (
		<ModalBackdrop>
			<ModalContent>
				{type === 'mobile' && <MobileContent />}
				{type === 'desktop' && <DesktopContent />}
				{type === 'location' && <LocationContent />}
				{type === 'newUser' && <NewUserContent />}

				{showDisableCheckbox && (
					<CheckboxLabel>
						<CheckboxInput type='checkbox' checked={disableAlert} onChange={() => setDisableAlert(!disableAlert)} />
						Don't show this again
					</CheckboxLabel>
				)}

				<ButtonContainer>
					{showBack && <AlertButton onClick={() => setSegmentIndex(segmentIndex - 1)}>Back</AlertButton>}
					{showNext && <AlertButton onClick={() => setSegmentIndex(segmentIndex + 1)}>Next</AlertButton>}
					{!showNext && <AlertButton onClick={handleClose}>OK</AlertButton>}
				</ButtonContainer>
			</ModalContent>
		</ModalBackdrop>
	);
};

export default AlertModal;
