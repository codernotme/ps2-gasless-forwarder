export const config = {
  // Contract addresses
  FORWARDER_ADDRESS: process.env.NEXT_PUBLIC_FORWARDER_ADDRESS || '',
  
  // API endpoints
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  
  // Network configuration
  SUPPORTED_NETWORKS: {
    1: { 
      name: "Ethereum", 
      chainId: "0x1", 
      rpcUrl: process.env.NEXT_PUBLIC_MAINNET_RPC,
      forwarderAddress: process.env.NEXT_PUBLIC_MAINNET_FORWARDER
    },
    5: { 
      name: "Goerli", 
      chainId: "0x5", 
      rpcUrl: process.env.NEXT_PUBLIC_GOERLI_RPC,
      forwarderAddress: process.env.NEXT_PUBLIC_GOERLI_FORWARDER
    },
    137: { 
      name: "Polygon", 
      chainId: "0x89", 
      rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC,
      forwarderAddress: process.env.NEXT_PUBLIC_POLYGON_FORWARDER
    }
  },
  
  // Feature flags
  ENABLE_GASLESS: process.env.NEXT_PUBLIC_ENABLE_GASLESS === 'true',
  
  // API Keys
  INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID || '',
  ETHERSCAN_API_KEY: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || ''
} 