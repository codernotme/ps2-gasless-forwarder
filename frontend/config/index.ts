export const config = {
  // Contract addresses
  FORWARDER_ADDRESS: process.env.NEXT_PUBLIC_FORWARDER_ADDRESS || '',
  
  // API endpoints
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  
  // Network configuration
  SUPPORTED_NETWORKS: {
    1: { name: "Ethereum", chainId: "0x1", rpcUrl: process.env.NEXT_PUBLIC_MAINNET_RPC },
    5: { name: "Goerli", chainId: "0x5", rpcUrl: process.env.NEXT_PUBLIC_GOERLI_RPC },
    137: { name: "Polygon", chainId: "0x89", rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC }
  },
  
  // Feature flags
  ENABLE_GASLESS: process.env.NEXT_PUBLIC_ENABLE_GASLESS === 'true'
} 