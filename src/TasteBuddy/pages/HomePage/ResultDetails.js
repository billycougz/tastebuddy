import React, { useState } from 'react';
import styled from 'styled-components';
import { TextArea, Button, Input, Paragraph } from '../../styles';
import { saveReview } from '../../localStorage';
import NearbyLocations from '../../components/NearbyLocations';
import { emojiRatingMap } from '../../emojis';

const DetailContainer = styled.div`
	padding: 0 5px;
	margin-bottom: 20px;
`;

const Heading = styled.h2`
	font-size: 1.5rem;
	margin-bottom: 10px;
`;

const Text = styled.p`
	margin-bottom: 10px;
`;

const Label = styled.span`
	font-weight: bold;
`;

const RatingContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 10px 0;
`;

const EmojiRating = styled.span`
	font-size: 2rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	cursor: pointer;
	margin-right: 10px;

	span {
		font-size: 0.8rem;
	}
`;

const H2 = styled.h2`
	font-size: 1em;
`;

const ErrorText = styled.p`
	color: red;
	font-size: 0.8rem;
	margin-top: 5px;
`;

const TasteBuddyDescription = styled.p`
	font-size: 1rem;
	margin: 5px 0 0;
	color: #999;
`;

const FlexContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

export default function ResultDetails({ nearbyPlaces, menuIds, result, onSave }) {
	const [showReview, setShowReview] = useState(false);
	const [selectedRating, setSelectedRating] = useState(null);
	const [notes, setNotes] = useState('');
	const [establishment, setEstablishment] = useState('');
	const [displayLocationModal, setDisplayLocationModal] = useState(false);
	const [errorMessages, setErrorMessages] = useState({
		rating: '',
		notes: '',
		establishment: '',
	});

	const handleOrderClick = () => {
		setShowReview(true);
	};

	const handleRatingClick = (rating) => {
		setSelectedRating(rating);
		clearErrorMessage('rating');
	};

	const validateFields = () => {
		const errors = {};

		if (!selectedRating) {
			errors.rating = 'Please select a rating.';
		} else {
			clearErrorMessage('rating');
		}

		if (!establishment) {
			errors.establishment = 'Please enter the establishment name.';
		} else {
			clearErrorMessage('establishment');
		}

		setErrorMessages(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSaveClick = () => {
		if (validateFields()) {
			const review = {
				...result,
				menuIds,
				rating: selectedRating,
				notes,
				establishment,
				createdAt: Date.now(),
			};
			saveReview(review);
			onSave();
		}
	};

	const clearErrorMessage = (field) => {
		setErrorMessages((prevErrors) => ({
			...prevErrors,
			[field]: '',
		}));
	};

	const handleLocationModalClose = (location) => {
		if (location) {
			setEstablishment(location);
			clearErrorMessage('establishment');
		}
		setDisplayLocationModal(false);
	};

	return (
		<DetailContainer>
			<Heading>{result.name}</Heading>
			{!showReview && (
				<>
					<TasteBuddyDescription>{result.reason}</TasteBuddyDescription>

					{result.description && (
						<Text>
							<Label>Menu Description:</Label> {result.description}
						</Text>
					)}

					{result.price && (
						<Text>
							<Label>Menu Price:</Label> ${result.price}
						</Text>
					)}

					<Button fullWidth onClick={handleOrderClick}>
						Order This
					</Button>
				</>
			)}
			{showReview && (
				<>
					<H2>How was it?</H2>
					<RatingContainer>
						{Object.values(emojiRatingMap).map(({ emoji, caption, id }) => (
							<EmojiRating
								onClick={() => handleRatingClick(id)}
								style={{ color: selectedRating === id ? 'orange' : 'gray' }}
							>
								{emoji}
								<span>{caption}</span>
							</EmojiRating>
						))}
					</RatingContainer>
					{errorMessages.rating && <ErrorText>{errorMessages.rating}</ErrorText>}

					<FlexContainer>
						<div>
							<NearbyLocations
								locations={nearbyPlaces}
								isOpen={displayLocationModal}
								onClose={handleLocationModalClose}
							/>
							<Input
								$prompt
								placeholder='Restaurant or establishment name...'
								value={establishment.name}
								onClick={() => setDisplayLocationModal(true)}
								style={{ '&::focus': { cursor: 'none' } }}
							/>

							{errorMessages.establishment && <ErrorText>{errorMessages.establishment}</ErrorText>}
						</div>

						<div style={{ margin: '0 0 -4px 0' }}>
							<TextArea
								placeholder='Notes, modifications, etc. (optional)'
								value={notes}
								onChange={(e) => {
									setNotes(e.target.value);
									clearErrorMessage('notes');
								}}
							/>
						</div>

						<Button fullWidth onClick={handleSaveClick}>
							Save Review
						</Button>
					</FlexContainer>
				</>
			)}
		</DetailContainer>
	);
}
