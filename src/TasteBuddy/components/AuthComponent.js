import React from 'react';
import { Auth } from 'aws-amplify';
import { WhiteButton } from '../styles';

const AuthComponent = () => {
	const handleLogin = async () => {
		try {
			await Auth.federatedSignIn();
		} catch (error) {
			console.log('Error signing in:', error);
		}
	};

	return (
		<div style={{ width: 'calc(100vw - 30px)', maxWidth: '400px' }}>
			<WhiteButton fullWidth onClick={handleLogin}>
				Login
			</WhiteButton>
		</div>
	);
};

export default AuthComponent;
