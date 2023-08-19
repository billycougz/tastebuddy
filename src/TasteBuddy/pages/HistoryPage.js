import React, { useState } from 'react';
import styled from 'styled-components';
import { PageContainer, Input, ScrollContainer, Dropdown } from '../styles';
import { getReviews } from '../localStorage';
import { emojiRatingMap } from '../emojis';

const FilterContainer = styled.div`
	display: flex;
	align-items: center;
`;

const ReviewCard = styled.div`
	border: 1px solid #ccc;
	border-radius: 8px;
	padding: 10px;
`;

const ReviewHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	font-size: 1rem;
`;

const ReviewName = styled.h3`
	margin: 0;
`;

const ReviewExpandIcon = styled.span`
	font-size: 1.2rem;
`;

const ExpandedContent = styled.div`
	margin-top: 10px;
`;

const ReviewProperty = styled.p`
	margin: 1rem 0;
`;

const ReviewDate = styled.p`
	margin: 0;
	color: #666;
`;

export default function HistoryPage() {
	const [reviews, setReviews] = useState(getReviews());

	const detailProperties = [
		{ property: 'description', caption: 'Menu Description' },
		{ property: 'price', caption: 'Menu Price' },
		{ property: 'mood', caption: 'Your Mood' },
		{ property: 'reason', caption: 'TasteBuddy Recommendation' },
		{ property: 'notes', caption: 'Your Notes' },
	];

	const filterProperties = [
		{ property: 'name', caption: 'Item Name' },
		{ property: 'establishment', subProperty: 'name', caption: 'Establishment Name' },
		{ property: 'rating', caption: 'Rating' },
		...detailProperties,
	];

	const [selectedFilter, setSelectedFilter] = useState('');

	const [filters, setFilters] = useState(
		filterProperties.reduce((obj, { property }) => {
			obj[property] = '';
			return obj;
		}, {})
	);

	const toggleExpand = (index) => {
		setReviews((prevReviews) =>
			prevReviews.map((review, i) => (i === index ? { ...review, expanded: !review.expanded } : review))
		);
	};

	const handleFilterChange = (filter) => {
		setSelectedFilter(filter);
		setFilters((prevFilters) => ({
			...prevFilters,
			[filter]: '',
		}));
	};

	const handleValueChange = (value) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			[selectedFilter]: value,
		}));
	};

	const filteredReviews = reviews.filter((review) => {
		const filtersMatch = filterProperties.every(({ property, subProperty }) => {
			const reviewValue = subProperty ? review[property][subProperty] : review[property];
			return filters[property] === '' || reviewValue?.toLowerCase().includes(filters[property].toLowerCase());
		});
		return filtersMatch;
	});

	return (
		<PageContainer>
			<FilterContainer>
				<Dropdown
					$placeholder={!Boolean(selectedFilter)}
					onChange={(e) => handleFilterChange(e.target.value)}
					value={selectedFilter}
				>
					<option value=''>Filters</option>
					{filterProperties.map(({ property, caption }) => (
						<option key={property} value={property}>
							{caption}
						</option>
					))}
				</Dropdown>
				{selectedFilter && (
					<Input
						type='text'
						placeholder={`Search ${selectedFilter}`}
						onChange={(e) => handleValueChange(e.target.value)}
						value={filters[selectedFilter]}
						disabled={selectedFilter === ''}
					/>
				)}
			</FilterContainer>

			{!Boolean(filteredReviews.length) && <p>No reviews yet.</p>}

			{Boolean(filteredReviews.length) && (
				<ScrollContainer>
					{filteredReviews.map((review, index) => (
						<ReviewCard key={index}>
							<ReviewHeader onClick={() => toggleExpand(index)}>
								<ReviewName>{review.name}</ReviewName>
								<ReviewExpandIcon>{review.expanded ? '-' : '+'}</ReviewExpandIcon>
							</ReviewHeader>
							<ReviewProperty>{review.establishment?.name}</ReviewProperty>
							<ReviewDate>
								{emojiRatingMap[review.rating].emoji} • {new Date(review.createdAt).toDateString()}
							</ReviewDate>
							{review.expanded && (
								<ExpandedContent>
									{detailProperties
										.filter(({ property }) => review[property])
										.map(({ property, caption }) => (
											<ReviewProperty>
												<strong>{caption}:</strong> {review[property]}
											</ReviewProperty>
										))}
								</ExpandedContent>
							)}
						</ReviewCard>
					))}
				</ScrollContainer>
			)}
		</PageContainer>
	);
}
