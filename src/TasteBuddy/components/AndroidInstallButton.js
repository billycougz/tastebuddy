import React, { useState } from 'react';
import styled from 'styled-components';
import { Button as button, colors } from '../styles';

const Button = styled(button)`
	display: block;
	margin: 2rem auto;
	background-color: white;
	color: #333;
`;

const AndroidInstallButton = () => {
	const [isInstallPromptVisible, setInstallPromptVisible] = useState(false);

	const handleInstallClick = () => {
		if ('beforeinstallprompt' in window) {
			const installPromptEvent = new Event('beforeinstallprompt');
			window.dispatchEvent(installPromptEvent);

			window.addEventListener('beforeinstallprompt', (event) => {
				event.preventDefault(); // Prevent the default behavior of showing the install prompt
				setInstallPromptVisible(true);

				const installPrompt = event;
				installPrompt.userChoice.then((choiceResult) => {
					if (choiceResult.outcome === 'accepted') {
						console.log('User accepted the install prompt');
					} else {
						console.log('User dismissed the install prompt');
					}
					setInstallPromptVisible(false);
				});
			});
		}
	};

	return (
		<div>
			<Button fullWidth onClick={handleInstallClick}>
				{isInstallPromptVisible ? 'Installing...' : 'Install TasteBuddy'}
			</Button>
		</div>
	);
};

export default AndroidInstallButton;
