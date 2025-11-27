import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mantle, mantleSepoliaTestnet } from '@reown/appkit/networks'

// Hardcoded Reown project ID
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'cb44e6bd7a2139350e8c0fb2d0fea8cb'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Use Mantle networks
export const networks = [mantle, mantleSepoliaTestnet]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
