# Web3 Integration Setup Guide

This guide explains how to set up the Web3 wallet integration with Monad chain for the KuntCalendar application.

## Overview

The Web3 integration allows users to:
1. Connect their Web3 wallets (MetaMask, Reown/WalletConnect, Coinbase Wallet)
2. Pay to unlock other users' entries using MONAD tokens
3. View unlocked entries with full details

## Prerequisites

1. **Monad Testnet Access**: You need access to Monad testnet
2. **Reown (WalletConnect) Project ID**: For Reown integration ([get one here](https://cloud.walletconnect.com/))
3. **Smart Contract Deployment**: The EntryUnlock contract needs to be deployed

## Setup Steps

### 1. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Reown (WalletConnect) Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Deployed contract address (after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

### 2. Install Packages

Install the required packages for Reown and wagmi integration:

```bash
npm install @reown/appkit @reown/appkit-adapter-wagmi @tanstack/react-query wagmi viem
```

### 3. Smart Contract Deployment

#### Deploy to Monad Testnet

1. **Install Hardhat** (if not already installed):
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. **Initialize Hardhat**:
```bash
npx hardhat init
```

3. **Configure Hardhat** for Monad testnet in `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    monadTestnet: {
      url: "https://rpc.testnet.monad.xyz",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1337, // Replace with actual Monad testnet chain ID
    },
  },
};
```

4. **Deploy the contract**:
```bash
npx hardhat run scripts/deploy.js --network monadTestnet
```

5. **Update the contract address** in your `.env.local` file with the deployed address.

### 4. Database Migration

Run the database migration to add wallet support:

```bash
# Apply the migration
supabase db push
```

### 5. Update Contract ABI

After deployment, update the ABI in `app/hooks/useEntryUnlock.js` with the actual contract ABI from your deployment.

## Reown (WalletConnect) Integration

WalletConnect is now rebranded as **Reown**. We use the new [Reown AppKit](https://docs.reown.com/appkit/next/core/installation) for wallet connection.

### Provider Setup

Wrap your app with both providers:

```jsx
import { AppKitProvider } from '@reown/appkit';
import { ReownWagmiProvider } from '@reown/appkit-adapter-wagmi';

<AppKitProvider config={{ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID, chains: [monadChain] }}>
  <ReownWagmiProvider config={wagmiConfig}>
    {/* ... */}
  </ReownWagmiProvider>
</AppKitProvider>
```

### Wallet Connect Button

Use the Reown modal for wallet connection:

```jsx
import { useConnectModal } from '@reown/appkit';

const { open } = useConnectModal();

<button onClick={open}>Connect Wallet</button>
```

### Environment Variable

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_reown_project_id
```

For more, see: [Reown AppKit Next.js Docs](https://docs.reown.com/appkit/next/core/installation)

## Features

### Wallet Connection

- **Supported Wallets**: MetaMask, Reown (WalletConnect), Coinbase Wallet
- **Auto-save**: Wallet addresses are automatically saved to the user's profile
- **Persistent**: Wallet connections persist across sessions

### Entry Unlocking

- **Payment Required**: Users must pay 0.001 MONAD to unlock an entry
- **Smart Contract**: All payments are verified on-chain
- **One-time Payment**: Each entry only needs to be unlocked once per user

### UI Components

- **Lock Icons**: Show locked/unlocked status for each entry
- **Payment Modal**: Clear payment interface with price display
- **Transaction Status**: Real-time feedback during payment processing

## Smart Contract Details

### EntryUnlock Contract

The smart contract handles:
- Payment verification
- Entry unlocking status
- Payment history tracking

#### Key Functions:
- `unlockEntry(address entryOwner, string entryId)`: Pay to unlock an entry
- `isEntryUnlocked(address entryOwner, string entryId)`: Check if entry is unlocked
- `unlockPrice`: Get current unlock price (0.001 MONAD)

#### Events:
- `EntryUnlocked`: Emitted when an entry is successfully unlocked

## API Endpoints

### `/api/users/wallet`
- `POST`: Save user's wallet address
- `GET`: Retrieve user's wallet address

## Security Considerations

1. **RLS Policies**: Database access is controlled by Row Level Security
2. **Smart Contract**: All payments are verified on-chain
3. **Wallet Verification**: Only authenticated users can save wallet addresses

## Testing

### Testnet Setup

1. **Get Testnet MONAD**: Use the Monad testnet faucet
2. **Connect Testnet**: Add Monad testnet to your wallet
3. **Test Payments**: Try unlocking entries with testnet tokens

### Test Scenarios

1. **Wallet Connection**: Test connecting different wallet types
2. **Entry Unlocking**: Test paying to unlock entries
3. **Status Updates**: Verify lock icons update correctly
4. **Transaction Handling**: Test failed transactions and error states

## Troubleshooting

### Common Issues

1. **Wallet Not Connecting**:
   - Check if Reown project ID is set
   - Verify wallet supports Monad chain
   - Check browser console for errors

2. **Transaction Fails**:
   - Ensure sufficient MONAD balance
   - Check if Monad testnet is added to wallet
   - Verify contract address is correct

3. **Lock Status Not Updating**:
   - Check if contract ABI is correct
   - Verify blockchain network connection
   - Check transaction confirmation status

### Debug Mode

Enable debug logging by adding to your `.env.local`:
```bash
NEXT_PUBLIC_DEBUG=true
```

## Production Deployment

### Mainnet Considerations

1. **Contract Deployment**: Deploy to Monad mainnet
2. **Price Adjustment**: Consider adjusting unlock price for mainnet
3. **Security Audit**: Consider professional security audit
4. **Monitoring**: Set up transaction monitoring and alerts

### Environment Variables for Production

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=your_mainnet_contract_address
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify all environment variables are set
4. Ensure database migrations are applied

## Future Enhancements

Potential improvements:
1. **Batch Unlocking**: Pay once to unlock multiple entries
2. **Subscription Model**: Monthly fee for unlimited access
3. **Revenue Sharing**: Share payments with entry owners
4. **NFT Integration**: Mint NFTs for unlocked entries
5. **Social Features**: Share unlocked entries with friends 