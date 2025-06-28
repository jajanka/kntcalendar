'use client';

import { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useConnect } from 'wagmi';
import { useSupabase } from './SupabaseProvider';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const { user } = useSupabase();
  const [savingWallet, setSavingWallet] = useState(false);

  // Save wallet address when connected
  useEffect(() => {
    if (isConnected && address && user) {
      saveWalletAddress();
    }
  }, [isConnected, address, user]);

  const saveWalletAddress = async () => {
    if (!address || !user) return;
    try {
      setSavingWallet(true);
      const response = await fetch('/api/users/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: address }),
      });
      if (!response.ok) {
        console.error('Failed to save wallet address');
      }
    } catch (error) {
      console.error('Error saving wallet address:', error);
    } finally {
      setSavingWallet(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleConnect = () => {
    // Try to connect with the first available connector (usually MetaMask)
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  if (!user) {
    return null; // Only show wallet connect for logged in users
  }

  return (
    <div className="relative">
      {isConnected ? (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            {savingWallet && (
              <div className="w-3 h-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            )}
          </div>
          <button
            onClick={handleDisconnect}
            className="btn btn-outline btn-sm"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="btn btn-outline btn-sm"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
} 