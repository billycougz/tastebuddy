import React, { useState } from 'react';
import styled from 'styled-components';
import Nav from './components/Nav';
import AboutPage from './pages/AboutPage';
import HistoryPage from './pages/HistoryPage';
import HomePage from './pages/HomePage';
import AlertModal from './components/AlertModal';
import localStorage, { storeFeedbackGroup } from './localStorage';

const AppContainer = styled.div`
	background-color: #1a1a1a;
	color: #ffffff;
	height: 100vh;
`;

const Main = styled.main`
	height: calc(100vh - 65px);
	padding: 1rem;
	padding-bottom: 0;
`;

storeFeedbackGroup();

export default function TasteBuddy() {
	const [view, setView] = useState('home-page');
	const [showAlertType, setShowAlertType] = useState(getOnLoadAlertType()); // '' | 'mobile' | 'desktop'

	return (
		<AppContainer>
			{showAlertType && <AlertModal type={showAlertType} onClose={() => setShowAlertType('')} />}
			<Main>
				<HomePage isVisible={view === 'home-page'} setView={setView} />
				{view === 'history-page' && <HistoryPage />}
				{view === 'about-page' && <AboutPage />}
			</Main>
			<Nav view={view} onChange={setView} />
		</AppContainer>
	);
}

function getOnLoadAlertType() {
	let type = '';

	const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

	if (!isMobile) {
		type = 'desktop';
	}

	// Note: isSafari doesn't actually work
	const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	const isiOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
	const isInStandaloneMode = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;

	if (isSafari && isiOS && !isInStandaloneMode) {
		type = 'mobile';
	}

	const storedValue = localStorage.getItem(`tastebuddy-${type}-alert-disabled`);
	if (storedValue === 'true') {
		return '';
	}

	return type;
}
