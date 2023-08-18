import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, PageContainer } from '../../styles';

const FadeContainer = styled.div`
	opacity: ${({ $fadeIn }) => ($fadeIn ? 1 : 0)};
	transition: opacity 1s ease-in-out;
`;

const Title = styled.h1`
	font-size: 3rem;
	font-weight: bold;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
	margin-bottom: -1rem;
`;

const SplashScreen = ({ onMenuSelected }) => {
	const [fadeIn, setFadeIn] = useState(false);

	const handleMenuSelected = () => {
		const inputElement = document.createElement('input');
		inputElement.type = 'file';
		inputElement.accept = 'image/*';
		inputElement.multiple = true;
		inputElement.hidden = true;
		const app = document.getElementById('root');
		app.appendChild(inputElement);
		inputElement.onchange = (e) => {
			const files = Object.values(e.target.files);
			onMenuSelected(files);
			app.removeChild(inputElement);
		};

		inputElement.click();
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setFadeIn(true);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<PageContainer vCenter hCenter>
			<Title>TasteBuddy</Title>
			<sub>Your AI companion for food & drink recommendations</sub>
			<FadeContainer $fadeIn={fadeIn}>
				<Button onClick={handleMenuSelected}>
					Upload Menu <span>📷</span>
				</Button>
			</FadeContainer>
		</PageContainer>
	);
};

export default SplashScreen;
