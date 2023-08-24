import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	Button,
	FlexContainer,
	Heading1,
	Heading2,
	Heading3,
	Input,
	Link,
	List,
	ListItem,
	PageContainer,
	Paragraph,
	ScrollContainer,
	TextArea,
	WhiteButton,
	InputWithIcon,
} from '../styles';
import AlertModal from '../components/AlertModal';
import { isMobile, isStandalone, useAppVersion } from '../utils';
import FeedbackModal from '../components/FeedbackModal';
import UserProfile from '../components/UserProfile';

const Section = styled.div`
	margin-bottom: 1rem;
`;

const Card = styled.div`
	background-color: #333; /* Dark theme background color */
	padding: 1rem;
	border-radius: 8px;
	box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Card shadow */
`;

const Version = styled.p`
	margin: -1rem 0 0 0;
	font-size: 0.75rem;
`;

export default function AboutPage() {
	const appVersion = useAppVersion();
	const [showInstallSteps, setShowInstallSteps] = useState(false);
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);

	return (
		<PageContainer>
			<Heading1>About TasteBuddy</Heading1>
			<Version>Version {appVersion}</Version>
			<ScrollContainer>
				<Section>
					<Paragraph mt='0'>
						TasteBuddy is powered by the GPT AI and uses your personal taste preferences to help you find the menu items
						that you will most enjoy.
					</Paragraph>
					<Paragraph>Try TasteBuddy at a restaurant, brewery, or anywhere that sells food and drinks.</Paragraph>
				</Section>
				<Section>
					<Card>
						<Heading2>TasteBuddy Beta</Heading2>
						<Paragraph>TasteBuddy is in a beta-development stage. Congratulations on getting in early!</Paragraph>
						<Paragraph>See below for what this means for you and the progression of the app.</Paragraph>
					</Card>
				</Section>
				<Section>
					<Card>
						<Heading3>App & Browsers</Heading3>
						<Paragraph>
							Eventually TasteBuddy will have native iOS & Android apps but the current version of TasteBuddy runs
							within the browser.
						</Paragraph>
						{!isStandalone() && (
							<>
								{!isMobile() && (
									<Paragraph>
										<strong>Desktop Notice: </strong>While TasteBuddy can be used on desktop devices, it is designed for
										mobile and the desktop experience will likely look and feel subpar.
									</Paragraph>
								)}
								{isMobile() && (
									<Paragraph>
										Add TasteBuddy to your Home Screen for the best experience.
										<WhiteButton mt='1rem' fullWidth onClick={() => setShowInstallSteps(true)}>
											Add TasteBuddy to your Home Screen
										</WhiteButton>
										{showInstallSteps && (
											<AlertModal type='mobile' hideDisable onClose={() => setShowInstallSteps(false)} />
										)}
									</Paragraph>
								)}
							</>
						)}
						{isStandalone() && (
							<Paragraph>
								You've enabled the best TasteBuddy experience by adding the app to your Home Screen.
							</Paragraph>
						)}
					</Card>
				</Section>

				<Section>
					<Card>
						<Heading3>Accounts & Data</Heading3>
						<Paragraph>The current version of TasteBuddy does not require you to create an account.</Paragraph>
						<Paragraph>
							Your TasteBuddy data, such as your preferences and review history, is all stored within your browser. If
							you use multiple browsers, each will have a separate set of data.
						</Paragraph>
						{/* <Paragraph>
							You can optionally provide your info enabling me to contact you for feedback.
							<UserProfile />
						</Paragraph> */}
					</Card>
				</Section>
				<Section>
					<Card>
						<Heading3>Feedback & Questions</Heading3>
						<Paragraph>
							Submit your feedback directly through the app and optionally provide your contact info.
							<List>
								<ListItem>Report a bug or inaccurate data</ListItem>
								<ListItem>Suggest a UX change</ListItem>
								<ListItem>Request a feature</ListItem>
								<ListItem>Ask a question</ListItem>
								<ListItem>Provide general feedback</ListItem>
							</List>
						</Paragraph>
						<WhiteButton fullWidth onClick={() => setShowFeedbackModal(true)}>
							Begin
						</WhiteButton>
						<FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
					</Card>
				</Section>
			</ScrollContainer>
		</PageContainer>
	);
}
