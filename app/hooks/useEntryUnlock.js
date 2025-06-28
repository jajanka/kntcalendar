'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

// Contract ABI - you'll need to replace this with the actual ABI after deployment
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "payer",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "entryOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "entryId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "EntryUnlocked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newPrice",
        "type": "uint256"
      }
    ],
    "name": "PriceUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "unlockedEntries",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unlockPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "entryOwner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "entryId",
        "type": "string"
      }
    ],
    "name": "isEntryUnlocked",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "entryOwner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "entryId",
        "type": "string"
      }
    ],
    "name": "unlockEntry",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

// Replace with your deployed contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export function useEntryUnlock() {
  const { address, isConnected } = useAccount();
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Read unlock price
  const { data: unlockPrice, isLoading: priceLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'unlockPrice',
  });

  // Write function to unlock entry
  const { data: unlockData, writeContract, isPending: unlockLoading } = useWriteContract();

  // Wait for transaction
  const { isLoading: transactionLoading, isSuccess: transactionSuccess } = useWaitForTransactionReceipt({
    hash: unlockData,
  });

  // Check if entry is unlocked
  const checkEntryUnlocked = (entryOwner, entryId) => {
    const { data: isUnlocked, isLoading } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'isEntryUnlocked',
      args: [entryOwner, entryId],
    });
    return { isUnlocked, isLoading };
  };

  const handleUnlockEntry = async (entryOwner, entryId) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    if (!unlockPrice) {
      throw new Error('Unable to get unlock price');
    }

    setIsUnlocking(true);
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'unlockEntry',
        args: [entryOwner, entryId],
        value: unlockPrice,
      });
    } catch (error) {
      setIsUnlocking(false);
      throw error;
    }
  };

  // Reset loading state when transaction completes
  if (transactionSuccess && isUnlocking) {
    setIsUnlocking(false);
  }

  return {
    unlockPrice: unlockPrice ? parseEther(unlockPrice.toString()) : null,
    priceLoading,
    unlockEntry: handleUnlockEntry,
    isUnlocking: isUnlocking || unlockLoading || transactionLoading,
    transactionSuccess,
    checkEntryUnlocked,
    isConnected,
    address,
  };
} 