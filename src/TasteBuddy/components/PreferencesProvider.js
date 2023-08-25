import React, { createContext, useState } from 'react';
import { getPreferences, savePreferences } from '../localStorage';

export const PreferencesContext = createContext();

export default function PreferencesProvider({ children }) {
	const [preferences, setPreferences] = useState(getPreferences());

	const updatePreferences = (newPreferences) => {
		savePreferences(newPreferences);
		setPreferences(newPreferences);
	};

	return (
		<PreferencesContext.Provider value={{ preferences, updatePreferences }}>{children}</PreferencesContext.Provider>
	);
}
