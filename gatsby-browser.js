export const onServiceWorkerUpdateReady = () => {
	const answer = window.confirm(`A new version of TasteBuddy is available. ` + `Reload?`);

	if (answer === true) {
		window.location.reload();
	}
};
