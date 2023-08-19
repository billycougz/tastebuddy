import * as React from 'react';
import { styled, css } from 'styled-components';

export const fontSizes = {
	small: '0.875rem',
	medium: '1rem',
	large: '1.25rem',
	xLarge: '1.5rem',
};

export const colors = {
	gray1: '#333',
	gray2: '#555',
	gray3: '#666',
	gray4: '#999',
	white: '#ffffff',
	black: '#000000',
	red: 'red',
};

const marginProps = css`
	margin-top: ${({ mt }) => mt || 'initial'};
	margin-right: ${({ mr }) => mr || 'initial'};
	margin-bottom: ${({ mb }) => mb || 'initial'};
	margin-left: ${({ ml }) => ml || 'initial'};
`;

export const Title = styled.h1`
	font-size: 3rem;
	margin: 0 0 1rem 0;
`;

export const Heading1 = styled.h1`
	font-size: 2rem;
	${marginProps};
`;

export const Heading2 = styled.h2`
	font-size: 1.5rem;
	${marginProps};
`;

export const Heading3 = styled.h3`
	font-size: 1.25rem;
	margin: 0 0 1rem 0;
`;

export const Paragraph = styled.p`
	font-size: 1rem;
	line-height: 1.5;
	${marginProps}
`;

export const Link = styled.a`
	text-decoration: none;
	color: red;
	cursor: pointer;
`;

export const fadeInAnimation = css`
	opacity: ${({ fadeIn }) => (fadeIn ? 1 : 0)};
	transition: opacity 1s ease-in-out;
`;

export const flexStyles = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 1em;
`;

export const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	justify-content: ${({ vCenter }) => (vCenter ? 'center' : '')};
	align-items: ${({ hCenter }) => (hCenter ? 'center' : '')};
	height: 100%;
`;

export const FlexContainer = styled.div`
	${flexStyles};
`;

export const ScrollContainer = styled(PageContainer)`
	overflow: scroll;
	padding-bottom: 1rem;
`;

export const Button = styled.button`
	background-color: ${({ transparent }) => (transparent ? 'transparent' : '#333')};
	color: #fff;
	border: none;
	padding: 10px 20px;
	border-radius: 4px;
	font-size: 1rem;
	opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
	width: ${({ fullWidth }) => (fullWidth ? '100%' : 'initial')};
	cursor: pointer;
	transition: background-color 0.3s ease-in-out;
	${marginProps};
	&:hover {
		background-color: ${({ transparent }) => (transparent ? 'transparent' : '#555')};
	}
`;

export const Input = styled.input`
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
	background-color: #333;
	color: #ffffff;
	border: 1px solid #333;
	border-color: ${({ lightBorder }) => (lightBorder ? '#666' : '#333')};
	border-radius: 4px;
	font-size: 1rem;
	caret-color: ${({ $prompt }) => ($prompt ? 'transparent' : 'initial')};
	${marginProps};
`;

const TextAreaContainer = styled.div`
	position: relative;
	width: 100%;
`;

const ResizableTextArea = styled.textarea`
	border: 1px solid #333;
	border-color: ${({ lightBorder }) => (lightBorder ? '#666' : '#333')};
	border-radius: 4px;
	padding: 8px;
	width: 100%;
	min-height: 40px; /* Set a minimum height to prevent collapsing */
	background-color: #333;
	color: #ffffff;
	box-sizing: border-box;
	font-size: 1rem;
	resize: none; /* Disable manual resizing */
	overflow: hidden; /* Hide overflowing content */
`;

export const TextArea = ({ placeholder, lightBorder, value, onChange }) => {
	const handleChange = (event) => {
		onChange(event);
		// Automatically adjust the height based on content
		event.target.style.height = 'auto';
		event.target.style.height = `${event.target.scrollHeight}px`;
	};

	return (
		<TextAreaContainer>
			<ResizableTextArea
				lightBorder={lightBorder}
				value={value}
				onChange={handleChange}
				rows='3'
				placeholder={placeholder}
			/>
		</TextAreaContainer>
	);
};

export const Dropdown = styled.select`
	border: 1px solid #333;
	border-radius: 4px;
	background-color: #333;
	color: ${({ $placeholder }) => ($placeholder ? '#757575' : '#ffffff')};
	padding: 10px;
	font-size: 1rem;
	width: 100%;
	height: 40px;
	display: block;
`;

export const Option = styled.option``;
