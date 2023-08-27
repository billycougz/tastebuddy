import React from 'react';
import styled from 'styled-components';

const AlertContainer = styled.div`
	// padding: 0.75rem 1.25rem;
	padding: 0.5rem 1rem;
	margin-bottom: 1rem;
	border: 1px solid transparent;
	border-radius: 0.25rem;
`;

const SuccessAlert = styled(AlertContainer)`
	background-color: #d4edda;
	border-color: #c3e6cb;
	color: #155724;
`;

const WarningAlert = styled(AlertContainer)`
	background-color: #fff3cd;
	border-color: #ffeeba;
	color: #856404;
`;

const DangerAlert = styled(AlertContainer)`
	background-color: #f8d7da;
	border-color: #f5c6cb;
	color: #721c24;
`;

const InfoAlert = styled(AlertContainer)`
	background-color: #d1ecf1;
	border-color: #bee5eb;
	color: #0c5460;
`;

const InlineAlert = ({ content, type, children, onClick }) => {
	let AlertStyledComponent;

	switch (type) {
		case 'success':
			AlertStyledComponent = SuccessAlert;
			break;
		case 'warning':
			AlertStyledComponent = WarningAlert;
			break;
		case 'danger':
			AlertStyledComponent = DangerAlert;
			break;
		case 'info':
			AlertStyledComponent = InfoAlert;
			break;
		default:
			AlertStyledComponent = AlertContainer;
	}

	return <AlertStyledComponent onClick={onClick}>{children || content}</AlertStyledComponent>;
};

export default InlineAlert;
