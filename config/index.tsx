import { cookieStorage, createStorage, http } from '@wagmi/core'
import { createConfig } from 'wagmi'
import { defineChain } from 'viem'

// Define Mantle networks manually
export const mantle = defineChain({
  id: 5000,
  name: 'Mantle',
  nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.mantle.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Mantle Explorer', url: 'https://explorer.mantle.xyz' },
  },
})

export const mantleSepoliaTestnet = defineChain({
  id: 5003,
  name: 'Mantle Sepolia Testnet',
  nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.mantle.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Mantle Sepolia Explorer', url: 'https://explorer.sepolia.mantle.xyz' },
  },
  testnet: true,
})

export const networks = [mantle, mantleSepoliaTestnet]

// Set up the Wagmi Config
export const config = createConfig({
  chains: [mantle, mantleSepoliaTestnet],
  transports: {
    [mantle.id]: http(),
    [mantleSepoliaTestnet.id]: http(),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
})
