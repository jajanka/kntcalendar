'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createConfig, http, createStorage } from 'wagmi';
import { injected, coinbaseWallet } from 'wagmi/connectors';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Web3Context = createContext({});

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// Define Monad chain configuration
const monadChain = {
  id: 1337, // Replace with actual Monad chain ID
  name: 'Monad',
  nativeCurrency: {
    decimals: 18,
    name: 'MONAD',
    symbol: 'MONAD',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.monad.xyz'],
    },
    public: {
      http: ['https://rpc.testnet.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://explorer.testnet.monad.xyz',
    },
  },
};

const config = createConfig({
  chains: [monadChain],
  transports: {
    [monadChain.id]: http(),
  },
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'KuntCalendar',
    }),
  ],
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  }),
});

// Create a client
const queryClient = new QueryClient();

export function Web3Provider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <Web3Context.Provider value={{}}>
          {children}
        </Web3Context.Provider>
      </WagmiProvider>
    </QueryClientProvider>
  );
} 