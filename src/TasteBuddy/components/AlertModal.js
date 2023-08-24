import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Heading2, List, Paragraph, SubText, WhiteButton } from '../styles';
import localStorage, { getPreferences } from '../localStorage';
import { isAndroid, isMobile, isStandalone } from '../utils';
import PreferencesComponent from './PreferencesComponent';
import { GoShare } from 'react-icons/go';
import { BsPlusSquare } from 'react-icons/bs';
import AndroidInstallButton from './AndroidInstallButton';
import FeedbackModal from './FeedbackModal';

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
	max-width: calc(100vw - 40px);
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
	margin-top: 1rem;
`;

const CheckboxInput = styled.input`
	margin-right: 5px;
	margin-left: 0;
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
				While TasteBuddy can be used on desktop devices, it is designed for mobile and the desktop experience will
				likely look and feel subpar.
			</Paragraph>
		</div>
	);
}

function StandaloneContent() {
	return (
		<div>
			<Heading2>TasteBuddy App</Heading2>
			<Paragraph>
				Congratulations! You've enabled the best TasteBuddy experience by adding the app to your Home Screen.
			</Paragraph>
		</div>
	);
}

function MobileContent() {
	return (
		<div>
			<Heading2>TasteBuddy App</Heading2>
			<Paragraph>Add TasteBuddy to your Home Screen for the best experience:</Paragraph>
			{isAndroid() && <AndroidInstallButton />}
			{!isAndroid() && !isStandalone() && (
				<List ordered>
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
				</List>
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
			<Paragraph>TasteBuddy is your AI companion for food & drink recommendations. Simply:</Paragraph>
			<List>
				<ListItem>Give TasteBuddy your taste preferences</ListItem>
				<ListItem>Upload an image of any food or drink menu</ListItem>
				<ListItem>Tell TasteBuddy what you're in the mood for</ListItem>
			</List>
			<Paragraph>And let TasteBuddy take care of the rest!</Paragraph>
		</div>
	);
}

function BrowserContent() {
	if (isStandalone()) {
		return <StandaloneContent />;
	}
	return isMobile() ? <MobileContent /> : <DesktopContent />;
}

const PreferenceContainer = styled.div`
	margin: 1rem 0;
	overflow: scroll;
`;

function PreferenceContent() {
	return (
		<>
			<Heading2>Preferences</Heading2>
			<Paragraph>Help TasteBuddy build your taste profile by selecting your preferences.</Paragraph>
			<PreferenceContainer>
				<PreferencesComponent onUpdate={() => null} condensed />
			</PreferenceContainer>
		</>
	);
}

function IntroEndContent() {
	return (
		<div>
			<Heading2>Let's Get Started!</Heading2>
			<Paragraph>TasteBuddy understands your preferences and is ready for your first menu!</Paragraph>
		</div>
	);
}

const newUserSegments = [IntroContent, BrowserContent, PreferenceContent, IntroEndContent];

const AlertModal = ({ type, onClose, hideDisable }) => {
	const [disableAlert, setDisableAlert] = useState(false);
	const [segmentIndex, setSegmentIndex] = useState(0);
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);

	function SearchErrorContent() {
		return (
			<div>
				<Heading2>Something went wrong.</Heading2>
				<Paragraph>
					Please try again and report the issue if it persist.
					<br />
					<WhiteButton fullWidth mt='1rem' onClick={() => setShowFeedbackModal(true)}>
						Report
					</WhiteButton>
				</Paragraph>
			</div>
		);
	}

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

	const handleNextClick = () => {
		if (segmentIndex === 1 && !isStandalone()) {
			const message = isMobile()
				? `Are you sure you don't want to install the app?`
				: 'Are you sure you want to continue on desktop?';
			const doContinue = window.confirm(message);
			if (!doContinue) {
				return;
			}
		}
		if (segmentIndex === 2) {
			// ToDo: Handle better
			const preferenceCount = Object.values(getPreferences()).flat().length;
			if (!preferenceCount) {
				const doContinue = window.confirm('Continue without any preferences?');
				if (!doContinue) {
					return;
				}
			}
		}
		setSegmentIndex(segmentIndex + 1);
	};

	return (
		<ModalBackdrop>
			<FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
			<ModalContent>
				{type === 'mobile' && <MobileContent />}
				{type === 'desktop' && <DesktopContent />}
				{type === 'location' && <LocationContent />}
				{type === 'newUser' && <NewUserContent />}
				{type === 'searchError' && <SearchErrorContent />}

				{showDisableCheckbox && (
					<CheckboxLabel>
						<CheckboxInput type='checkbox' checked={disableAlert} onChange={() => setDisableAlert(!disableAlert)} />
						Don't show this again
					</CheckboxLabel>
				)}

				{showDisableCheckbox && type === 'newUser' && (
					<SubText>
						Revisit this information anytime from the <strong>About</strong> tab.
					</SubText>
				)}

				<ButtonContainer>
					{showBack && <AlertButton onClick={() => setSegmentIndex(segmentIndex - 1)}>Back</AlertButton>}
					{showNext && <AlertButton onClick={handleNextClick}>Next</AlertButton>}
					{!showNext && <AlertButton onClick={handleClose}>OK</AlertButton>}
				</ButtonContainer>
			</ModalContent>
		</ModalBackdrop>
	);
};

export default AlertModal;
