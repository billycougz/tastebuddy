import * as React from 'react';
import styled, { keyframes } from 'styled-components';

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const MobileModalContainer = styled.div`
	background: black;
	overflow: scroll;

	display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
	position: fixed;
	bottom: ${({ isMobile }) => (isMobile ? 0 : 'unset')};
	left: 0;
	width: 100%;
	height: ${({ isOpen, isMobile }) => (isMobile ? '100%' : isOpen ? 'unset' : 0)};
	border-top-left-radius: ${({ isMobile }) => (isMobile ? '20px' : 0)};
	border-top-right-radius: ${({ isMobile }) => (isMobile ? '20px' : 0)};
	box-shadow: ${({ isMobile }) => (isMobile ? '0 -2px 4px rgba(0, 0, 0, 0.2)' : 'none')};
	align-items: stretch;
	justify-content: flex-start;
	z-index: 1000;
	animation: ${({ isMobile }) => (isMobile ? slideUp : 'none')} 0.3s ease-out;

	@media (min-width: 768px) {
		/* For larger screens, adjust the styles as needed */
		display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-height: 500px;
		max-width: 750px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		z-index: 1000;
		lign-items: flex-start;
	}
`;

const ModalContent = styled.div`
	padding: 20px;
	width: 100%;
`;

const ModalCloseButton = styled.button`
	background: none;
	border: none;
	color: white;
	font-size: 1rem;
	cursor: pointer;
	float: right;
`;

const Header = styled.h1`
	margin: 0 0 10px 0;
	font-size: 1.5em;
`;

export default function Modal({ isOpen, onClose, header, children, closeText = 'Close' }) {
	const isMobile = window.innerWidth <= 768;
	return (
		<div>
			<MobileModalContainer isOpen={isOpen} isMobile={isMobile}>
				<ModalContent>
					<ModalCloseButton onClick={() => onClose()}>{closeText}</ModalCloseButton>
					<Header>{header || <br />}</Header>
					{children}
				</ModalContent>
			</MobileModalContainer>
		</div>
	);
}
