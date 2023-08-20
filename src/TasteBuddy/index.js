import React, { useState } from 'react';
import styled from 'styled-components';
import Nav from './components/Nav';
import AboutPage from './pages/AboutPage';
import HistoryPage from './pages/HistoryPage';
import HomePage from './pages/HomePage';
import AlertModal from './components/AlertModal';
import localStorage, { storeFeedbackGroup } from './localStorage';
import { isBrowser } from './utils';

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
	if (isBrowser()) {
		const isMobile = window.innerWidth <= 768;

		if (!isMobile) {
			type = 'desktop';
		}

		const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
		const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;

		if (isMobile && isiOS && !isInStandaloneMode) {
			type = 'mobile';
		}

		const isAlertDisabled = localStorage.getItem(`tastebuddy-${type}-alert-disabled`);
		if (isAlertDisabled === 'true') {
			return '';
		}
	}
	return type;
}
