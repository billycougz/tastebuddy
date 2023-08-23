import React, { useEffect, useState } from 'react';

import { BsFillCheckCircleFill } from 'react-icons/bs';
import { MdRadioButtonUnchecked } from 'react-icons/md';
import { getUserProfile, updateUserProfile } from '../localStorage';
import { InputWithIcon } from '../styles';

export default function UserProfile() {
	const [userInfo, setUserInfo] = useState(getUserProfile());

	useEffect(() => {
		updateUserProfile(userInfo);
	}, [userInfo]);

	return (
		<div>
			<InputWithIcon
				value={userInfo.name}
				onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
				placeholder='Name'
				lightBorder
				mt='1rem'
				icon={userInfo.name ? BsFillCheckCircleFill : MdRadioButtonUnchecked}
			/>
			<InputWithIcon
				value={userInfo.contact}
				onChange={(e) => setUserInfo({ ...userInfo, contact: e.target.value })}
				placeholder='Email or phone'
				lightBorder
				mt='1rem'
				icon={userInfo.contact ? BsFillCheckCircleFill : MdRadioButtonUnchecked}
			/>
		</div>
	);
}
