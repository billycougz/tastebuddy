import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../../components/Modal';
import ResultDetails from './ResultDetails';
import { PageContainer, ScrollContainer } from '../../styles';

function MenuItem({ result, onClick }) {
	const { name, reason } = result;

	const Container = styled.div`
		display: flex;
		flex-direction: column;
		padding: 10px;
		border-radius: 8px;
		border: 1px solid #666;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	`;

	const Title = styled.h1`
		font-size: 1rem;
		margin: 0;
	`;

	const Description = styled.p`
		font-size: 1rem;
		margin: 5px 0 0;
		color: #999;
	`;

	return (
		<Container onClick={() => onClick(result)}>
			<Title>{name}</Title>
			<Description>{reason}</Description>
		</Container>
	);
}

export default function ResultsComponent({ nearbyPlaces, searchResults, onReviewSubmitted }) {
	const [selectedResult, setSelectedResult] = useState(null);

	const { message, results, menuIds } = searchResults;

	return (
		<PageContainer>
			<Modal isOpen={Boolean(selectedResult)} onClose={() => setSelectedResult(null)} closeText='Cancel'>
				{selectedResult && (
					<ResultDetails
						nearbyPlaces={nearbyPlaces}
						menuIds={menuIds}
						result={selectedResult}
						onSave={() => onReviewSubmitted()}
					/>
				)}
			</Modal>
			{message}
			<ScrollContainer>
				{results.map((result) => (
					<MenuItem result={result} onClick={setSelectedResult} />
				))}
			</ScrollContainer>
		</PageContainer>
	);
}
