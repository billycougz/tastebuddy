import React, { useEffect, useState } from 'react';

import {
	Button,
	ErrorText,
	FlexContainer,
	Heading1,
	Heading2,
	Heading3,
	Input,
	Link,
	PageContainer,
	Paragraph,
	ScrollContainer,
	TextArea,
} from '../styles';
import Modal from './Modal';
import { postFeedback } from '../api';
import { getUserProfile } from '../localStorage';

export default function FeedbackModal({ isOpen, onClose }) {
	const emptyFeedback = { message: '', ...getUserProfile() };
	const [feedback, setFeedback] = useState(emptyFeedback);
	const [error, setError] = useState(''); // 'message' | ''
	const [success, setSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
		if (!feedback.message) {
			setError('message');
			return;
		}
		try {
			setIsLoading(true);
			const response = await postFeedback(feedback);
		} catch (e) {
			// ToDo
		}
		setIsLoading(false);
		setFeedback({ ...feedback, message: '' });
		setSuccess(true);
	};

	const handleMessageChange = (e) => {
		const message = e.target.value;
		if (message) {
			setError('');
			setSuccess(false);
		}
		setFeedback({ ...feedback, message });
	};

	const handleClose = () => {
		setError('');
		setSuccess(false);
		setFeedback(emptyFeedback);
		onClose();
	};

	return (
		<Modal header='Feedback & Questions' isOpen={isOpen} onClose={handleClose}>
			<Paragraph>Your feedback will be received immediately!</Paragraph>
			<Paragraph>Provide your name and contact info if you're open to be contacted for additional feedback.</Paragraph>
			{success && (
				<Paragraph color='green'>
					Your feedback was submitted! Send another message now or anytime you think of something.
				</Paragraph>
			)}
			<FlexContainer mt='1rem'>
				<TextArea
					disabled={isLoading}
					onChange={handleMessageChange}
					value={feedback.message}
					placeholder='Bugs, UX, features, questions, general feedback...'
					lightBorder
				/>
				{error === 'message' && <ErrorText>It doesn't appear you've written anything.</ErrorText>}
				<Input
					disabled={isLoading}
					onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
					value={feedback.name}
					type='text'
					placeholder='Name'
					lightBorder
				/>
				<Input
					disabled={isLoading}
					onChange={(e) => setFeedback({ ...feedback, contact: e.target.value })}
					value={feedback.contact}
					type='text'
					placeholder='Email or phone'
					lightBorder
				/>

				<Button onClick={handleSubmit} fullWidth disabled={isLoading}>
					Submit
				</Button>
			</FlexContainer>
		</Modal>
	);
}
