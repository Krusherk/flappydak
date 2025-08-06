import { createPrivy, PrivyProvider } from '@privy-io/react-auth';

const privy = createPrivy({
	appId: 'cme0joi9r00fxk10ampyw63t4',
});

async function login() {
	try {
		const user = await privy.login();
		if (user) {
			console.log('User logged in:', user);
			document.getElementById('wallet-address').textContent = user.wallet?.address || 'No address';
			document.getElementById('login-button').style.display = 'none';
		}
	} catch (error) {
		console.error('Login failed:', error);
	}
}

window.onload = () => {
	document.getElementById('login-button')?.addEventListener('click', login);
};
