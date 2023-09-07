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
	List,
	ListItem,
	WhiteButton,
} from '../styles';
import Modal from './Modal';
import { postFeedback } from '../api';
import { getUserProfile } from '../localStorage';
import UserProfile from './UserProfile';

export default function FeedbackModal({ isOpen, onClose }) {
	const createEmptyFeedback = () => ({ message: '', ...getUserProfile() });
	const [feedback, setFeedback] = useState(createEmptyFeedback());
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
		// Keep contact info if provided
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
		setFeedback(createEmptyFeedback());
		onClose();
	};

	const handleContactUpdate = (contactInfo) => {
		setFeedback({ ...feedback, ...contactInfo });
	};

	return (
		<Modal header='Feedback & Questions' isOpen={isOpen} onClose={handleClose}>
			<Paragraph>
				Your feedback is appreciated and will be received immediately! Your contact info is optional.
			</Paragraph>
			<List>
				<ListItem>Report an inaccurate recommendation</ListItem>
				<ListItem>Request a feature or change</ListItem>
				<ListItem>Report a bug</ListItem>
				<ListItem>Ask a question</ListItem>
			</List>
			<FlexContainer mt='1rem'>
				<TextArea
					disabled={isLoading}
					onChange={handleMessageChange}
					value={feedback.message}
					placeholder='Your feedback...'
					lightBorder
				/>
				{error === 'message' && <ErrorText>It doesn't appear you've written anything.</ErrorText>}

				<div style={{ marginTop: '-19px', width: '100%' }}>
					<UserProfile formOnly disableSave onUpdate={handleContactUpdate} />
				</div>

				<WhiteButton onClick={handleSubmit} fullWidth disabled={isLoading}>
					Submit
				</WhiteButton>
				{success && (
					<Paragraph color='green' mt='0' style={{ textAlign: 'center' }}>
						Your feedback was submitted! Send another message now or anytime you think of something.
					</Paragraph>
				)}
			</FlexContainer>
		</Modal>
	);
}
