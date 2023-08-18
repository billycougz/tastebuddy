import React from 'react';
import styled from 'styled-components';

const NavContainer = styled.nav`
	background-color: #333;
	color: white;
	position: fixed;
	width: 100%;
	bottom: 0;
`;

const NavList = styled.ul`
	display: flex;
	padding: 0;
	margin: 0;
	justify-content: center;
`;

const NavItem = styled.li`
	flex: 1;
	padding: 15px;
	text-align: center;
	cursor: pointer;
	font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
	background-color: ${({ isActive }) => (isActive ? '#444' : 'initial')};
	list-style-type: none;

	&:hover {
		background-color: ${({ isActive }) => (isActive ? '#444' : '#555')};
	}
`;

export default function Nav({ view, onChange }) {
	const handleTabClick = (tab) => {
		onChange(tab);
	};

	return (
		<NavContainer>
			<NavList>
				<NavItem isActive={view === 'home-page'} onClick={() => handleTabClick('home-page')}>
					Home
				</NavItem>
				<NavItem isActive={view === 'history-page'} onClick={() => handleTabClick('history-page')}>
					History
				</NavItem>
				<NavItem isActive={view === 'about-page'} onClick={() => handleTabClick('about-page')}>
					About
				</NavItem>
			</NavList>
		</NavContainer>
	);
}
