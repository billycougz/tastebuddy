import React, { useEffect, useState } from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { MdRadioButtonUnchecked } from 'react-icons/md';
import { getUserProfile, updateUserProfile } from '../localStorage';
import { Heading2, InputWithIcon, Paragraph } from '../styles';
import { styled } from 'styled-components';

const Container = styled.div`
	width: 100%;
`;

export default function UserProfile({ formOnly, onUpdate, disableSave }) {
	const [userInfo, setUserInfo] = useState(getUserProfile());

	useEffect(() => {
		if (onUpdate) {
			onUpdate(userInfo);
		}
		if (!disableSave) {
			updateUserProfile(userInfo);
		}
	}, [userInfo]);

	return (
		<Container>
			{!formOnly && (
				<>
					<Heading2>Contact Info</Heading2>
					<Paragraph>
						Optionally provide your contact information if you're open to being contacted for feedback and
						announcements.
					</Paragraph>
					<Paragraph>You can also provide feedback anytime through TasteBuddy's main menu.</Paragraph>
				</>
			)}
			<InputWithIcon
				value={userInfo.name}
				onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
				placeholder='Name'
				lightBorder
				mt='1rem'
				icon={userInfo.name ? BsFillCheckCircleFill : MdRadioButtonUnchecked}
			/>
			<InputWithIcon
				value={userInfo.email}
				onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
				placeholder='Email'
				lightBorder
				mt='1rem'
				icon={userInfo.email ? BsFillCheckCircleFill : MdRadioButtonUnchecked}
			/>
			<InputWithIcon
				value={userInfo.phone}
				onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
				placeholder='Phone'
				lightBorder
				mt='1rem'
				icon={userInfo.phone ? BsFillCheckCircleFill : MdRadioButtonUnchecked}
			/>
		</Container>
	);
}
