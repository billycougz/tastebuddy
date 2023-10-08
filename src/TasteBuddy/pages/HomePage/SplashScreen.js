import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, PageContainer } from '../../styles';
import { isDevelopment, compressFile } from '../../utils';
import AuthComponent from '../../components/AuthComponent';

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

const SplashScreen = ({ onMenuSelected, onMockUpload, user }) => {
	const [fadeIn, setFadeIn] = useState(false);

	const handleMenuSelected = () => {
		const inputElement = document.createElement('input');
		inputElement.type = 'file';
		// Accept whatever Textract accepts
		inputElement.accept = 'image/png,image/jpeg,image/tiff,application/pdf';
		inputElement.multiple = true;
		inputElement.hidden = true;
		const app = document.getElementById('___gatsby');
		app.appendChild(inputElement);
		inputElement.onchange = async (e) => {
			const files = Array.from(e.target.files);
			if (allFilesSupported(files)) {
				const compressedFiles = await Promise.all(files.map((file) => compressFile(file)));
				onMenuSelected(compressedFiles);
			} else {
				const message = `It seems you've selected an unsupported file type.\n\nAt this time, TasteBuddy only supports PNG, JPG, PDF, and TIFF.\n\nTo use this file, you can simply upload a screenshot.`;
				alert(message);
			}
			app.removeChild(inputElement);
		};

		inputElement.click();
	};

	const allFilesSupported = (files) => {
		// iOS does not enforce allowed image types requiring explicit validation (not sure about Android)
		const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'image/tiff'];
		return files.every((file) => allowedTypes.includes(file.type));
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
				{user && (
					<>
						<Button onClick={handleMenuSelected}>
							Upload Menu <span>📷</span>
						</Button>
						{isDevelopment() && (
							<>
								<br />
								<Button mt='1rem' onClick={onMockUpload}>
									Mock Upload <span>📷</span>
								</Button>
							</>
						)}
					</>
				)}

				{!user && <AuthComponent />}
			</FadeContainer>
		</PageContainer>
	);
};

export default SplashScreen;
