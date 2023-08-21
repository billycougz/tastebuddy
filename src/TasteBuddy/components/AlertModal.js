import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Heading2, Paragraph } from '../styles';
import localStorage from '../localStorage';
import { isAndroid, isMobile, isStandalone } from '../utils';
import PreferencesComponent from './PreferencesComponent';
import { GoShare } from 'react-icons/go';
import { BsPlusSquare } from 'react-icons/bs';
import AndroidInstallButton from './AndroidInstallButton';

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
	max-height: 100vh;
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

const ListItem = styled.li`
	line-height: 2rem;
`;

const AddToHomeScreenIcon = styled(BsPlusSquare)`
	position: relative;
	top: 3px;
	left: 2px;
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

function StandaloneContent() {
	return (
		<div>
			<Heading2>TasteBuddy App</Heading2>
			<Paragraph>Excellent! You are running TasteBuddy with the optimal experience.</Paragraph>
		</div>
	);
}

function MobileContent() {
	return (
		<div>
			<Heading2>TasteBuddy Browsers</Heading2>
			<Paragraph>
				TasteBuddy supports all browsers but for the best experience, install TasteBuddy as an app on your Home Screen:
			</Paragraph>
			{isAndroid() && <AndroidInstallButton />}
			{isStandalone() && <StandaloneContent />}
			{!isAndroid() && !isStandalone() && (
				<ol>
					<ListItem>
						Tap the browser's <GoShare /> button
					</ListItem>
					<ListItem>
						Select{' '}
						<strong>
							Add to Home Screen <AddToHomeScreenIcon />
						</strong>
					</ListItem>
					<ListItem>
						Tap <strong>Add</strong>
					</ListItem>
				</ol>
			)}
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
				Simply take a photo of any food or drink menu, tell TasteBuddy what you're in to mood for, and TasteBuddy will
				take care of the rest!
			</Paragraph>
		</div>
	);
}

function BrowserContent() {
	return isMobile() ? <MobileContent /> : <DesktopContent />;
}

const PreferenceContainer = styled.div`
	margin: 1rem -10px;
	max-height: 300px;
	overflow: scroll;
`;

function PreferenceContent() {
	return (
		<>
			<Heading2>Preferences</Heading2>
			<Paragraph>Help TasteBuddy build your taste profile.</Paragraph>
			<Paragraph>
				TasteBuddy pre-populates some items to choose from, but please add your own items if not already listed.
			</Paragraph>
			<PreferenceContainer>
				<PreferencesComponent onUpdate={() => null} />
			</PreferenceContainer>
		</>
	);
}

function IntroEndContent() {
	return (
		<div>
			<Heading2>Let's Eat!</Heading2>
			<Paragraph>
				TasteBuddy is ready for your first menu! You can revisit this information anytime from the{' '}
				<strong>About</strong> tab.
			</Paragraph>
			<Paragraph></Paragraph>
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
