// src/App.jsx
import { usePrivy, useLogin } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import './App.css';

const PRIVY_APP_ID = 'cme0joi9r00fxk10ampyw63t4';
const contractAddress = '0xb2EFbbC0cFC1898D7d2615856904d3f9785B7D29';
const abi = [
  {
    inputs: [],
    name: 'playAndPay',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
];

function App() {
  const { ready, authenticated, user, logout } = usePrivy();
  const { login } = useLogin();

  const handlePayAndPlay = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.playAndPay({
        value: ethers.parseEther('1.0')
      });
      await tx.wait();

      alert('✅ Payment successful! Launching game...');
      window.location.href = '/game.html';
    } catch (err) {
      console.error('❌ Payment failed:', err);
      alert('Payment failed. Check console for error.');
    }
  };

  if (!ready) return <div>Loading...</div>;

  return (
    <div className="app">
      <h1>Welcome to Flappy Dak</h1>

      {!authenticated ? (
        <button onClick={login}>Login with Privy</button>
      ) : (
        <>
          <p>Connected: {user?.wallet?.address}</p>
          <button onClick={logout}>Logout</button>
          <button onClick={handlePayAndPlay}>Pay 1 MON to Play</button>
        </>
      )}
    </div>
  );
}

export default App;
