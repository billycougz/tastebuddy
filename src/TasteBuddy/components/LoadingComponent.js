import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import foodEmojis from '../emojis';

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
`;

const Emoji = styled.span`
	font-size: 3rem;
`;

const Text = styled.p`
	font-size: 1.5rem;
	margin-top: 20px;
`;

const LoadingComponent = () => {
	const [visibleEmojis, setVisibleEmojis] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex - 1 + foodEmojis.length) % foodEmojis.length);
		}, 250);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const selectedEmojis = [
			foodEmojis[currentIndex],
			foodEmojis[(currentIndex + 1) % foodEmojis.length],
			foodEmojis[(currentIndex + 2) % foodEmojis.length],
		];
		setVisibleEmojis(selectedEmojis);
	}, [currentIndex]);

	return (
		<Container>
			<Text>Finding the food that suits your mood</Text>
			{visibleEmojis.map((emoji, index) => (
				<Emoji key={index}>{emoji}</Emoji>
			))}
		</Container>
	);
};

export default LoadingComponent;
