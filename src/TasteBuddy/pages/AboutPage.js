import React, { useState } from 'react';
import styled from 'styled-components';
import {
	Button,
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
import AlertModal from '../components/AlertModal';
import { useAppVersion } from '../utils';

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
	return (
		<PageContainer>
			<Heading1>About TasteBuddy</Heading1>
			<Version>Version {appVersion}</Version>
			<ScrollContainer>
				<Section>
					<Paragraph>
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
						<Heading3>Beta - Native App & Browsers</Heading3>
						<Paragraph>
							Eventually TasteBuddy will have native iOS & Android apps but the current version of TasteBuddy runs
							within the browser.
						</Paragraph>
						<Paragraph>
							<strong>Mobile: </strong>User experience quality can vary by browser. It is recommended to avoid using
							Safari, and for the best experience{' '}
							<Link onClick={() => setShowInstallSteps(true)}>add TasteBuddy to your Home Screen</Link>.
							{showInstallSteps && <AlertModal type='mobile' hideDisable onClose={() => setShowInstallSteps(false)} />}
						</Paragraph>
						<Paragraph>
							<strong>Desktop: </strong>While TasteBuddy should be fully functional on desktop devices, it is designed
							for mobile and the desktop experience will likely look and feel subpar.
						</Paragraph>
					</Card>
				</Section>

				<Section>
					<Card>
						<Heading3>Beta - Accounts & Data</Heading3>
						<Paragraph>
							The current version of TasteBuddy does not require you to create an account. Your TasteBuddy data, such as
							your preferences and review history, is all stored within your browser. If you use multiple browsers, each
							will have a separate set of data.
						</Paragraph>
					</Card>
				</Section>

				<Section>
					<Card>
						<Heading2 mb='0'>Provide Feedback</Heading2>

						<FlexContainer>
							<Paragraph>
								Let me know what you think. Provide your contact info if you're open to me reaching back out.
							</Paragraph>
							<TextArea placeholder='Feature ideas, bugs, general feedback...' lightBorder />
							<Input type='text' placeholder='Your name (optional)' lightBorder />
							<Input type='text' placeholder='Your phone or email (optional)' lightBorder />
							<Button fullWidth>Submit</Button>
						</FlexContainer>
					</Card>
				</Section>
			</ScrollContainer>
		</PageContainer>
	);
}
