import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import SplashScreen from './SplashScreen';
import MoodSelectionComponent from './MoodSelectionComponent';
import ResultsComponent from './ResultsComponent';
import Menu from '../../components/Menu';
import PreferencesComponent from '../../components/PreferencesComponent';
import localStorage from '../../localStorage';
import Modal from '../../components/Modal';
import { uploadMenu } from '../../api';
import { PageContainer } from '../../styles';
import { fetchNearbyPlaces } from '../../location-services';
import AlertModal from '../../components/AlertModal';

const Container = styled(PageContainer)`
	display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`;

export default function HomePage({ isVisible, setView }) {
	const [step, setStep] = useState('menu-selection');
	const [showPreferences, setShowPreferences] = useState(false);
	const [processedMenuIds, setProcessedMenuIds] = useState(null);
	const [searchResults, setSearchResults] = useState(null);
	const [showAlertType, setShowAlertType] = useState('');
	const [nearbyPlaces, setNearbyPlaces] = useState(null);

	useEffect(() => {
		if (step === 'menu-selection') {
			// Handle navigate back to menu-selection
			setProcessedMenuIds(null);
		}
	}, [step]);

	const handleMenuSelected = async (files) => {
		setStep('mood-selection');
		try {
			// Intentionally not awaiting to allow execution to continue
			uploadMenuAsync(files);
			if (doDisplayLocationAlert()) {
				setShowAlertType('location');
			} else {
				const results = await fetchNearbyPlaces();
				setNearbyPlaces(results);
			}
		} catch (e) {
			alert('There was an error uploading your menu.');
			setStep('menu-selection');
		}
	};

	/**
	 * Mock handleMenuSelected
	 */
	const handleMockUpload = () => {
		const bvp = '865503e0-8fe6-4464-9646-57dba68698e8.png';
		setProcessedMenuIds([bvp]);
		setStep('mood-selection');
	};

	const uploadMenuAsync = async (files) => {
		try {
			const s3Filenames = await uploadMenu(files);
			setProcessedMenuIds(s3Filenames);
		} catch (e) {
			handleSearchError(e);
		}
	};

	function doDisplayLocationAlert() {
		const KEY = 'tastebuddy-location-alert-disabled';
		const value = localStorage.getItem(KEY) || 'false';
		localStorage.setItem(KEY, true);
		return !Boolean(JSON.parse(value)); // Return false if disabled, true if not
	}

	const handleMoodSelected = (results) => {
		setSearchResults(results);
		setStep('result-selection');
	};

	const handleSearchError = (error) => {
		// ToDo: This is being used for more than just search error (i.e., upload error) - address this
		setShowAlertType('searchError');
		setStep('menu-selection');
	};

	const handleReviewSubmitted = () => {
		setView('history-page');
		setStep('menu-selection');
		setProcessedMenuIds(null);
		setSearchResults(null);
	};

	const handleCloseLocationModal = async () => {
		setShowAlertType('');
		const results = await fetchNearbyPlaces();
		setNearbyPlaces(results);
	};

	return (
		<Container isVisible={isVisible}>
			<Modal isOpen={showPreferences} header='Preferences' onClose={() => setShowPreferences(false)}>
				<PreferencesComponent />
			</Modal>

			{showAlertType && <AlertModal type={showAlertType} hideDisable onClose={handleCloseLocationModal} />}

			{step.includes('select') && <Menu view={step} onViewChange={setStep} onShowPreferences={setShowPreferences} />}

			{step === 'menu-selection' && (
				<SplashScreen onMenuSelected={handleMenuSelected} onMockUpload={handleMockUpload} />
			)}
			{step === 'mood-selection' && (
				<MoodSelectionComponent
					onSearchError={handleSearchError}
					onSearchResults={handleMoodSelected}
					processedMenuIds={processedMenuIds}
					setShowPreferences={setShowPreferences}
				/>
			)}
			{step === 'result-selection' && (
				<ResultsComponent
					nearbyPlaces={nearbyPlaces}
					searchResults={searchResults}
					onReviewSubmitted={handleReviewSubmitted}
				/>
			)}
		</Container>
	);
}
