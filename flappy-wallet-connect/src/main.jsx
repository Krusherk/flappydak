// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  getDefaultConfig,
  WagmiProvider,
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'Flappy Wallet Game',
  projectId: '0678b2fe34b992389f2ce627d2c517e0', // Get this from walletconnect.com
  chains: [mainnet],
  ssr: false,
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
