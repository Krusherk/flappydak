// App.jsx
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

function App() {
  const { address, isConnected } = useAccount();

  return (
    <div>
      <h1>Flappy Wallet Game</h1>
      <ConnectButton />
      
      {isConnected && (
        <div>
          <p>Wallet Connected: {address}</p>
          {/* This is where you can trigger "start game" or store the address */}
        </div>
      )}

      {/* Your Flappy Game iframe or component here */}
    </div>
  );
}

export default App;
