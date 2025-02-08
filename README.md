# RAWGAS - Neo-Brutalist Web3 Gasless Transaction Platform

RAWGAS is a cutting-edge Web3 platform that enables gasless token transfers through a secure forwarder smart contract, wrapped in an aggressive Neo-Brutalist interface.

![RAWGAS Platform](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2232&ixlib=rb-4.0.3)

## 🚀 Features

- **Gasless Transactions**: Execute token transfers without paying gas fees
- **Multi-Token Support**: Support for ERC-20 tokens
- **Secure Forwarding**: EIP-2771 compliant meta-transactions
- **Neo-Brutalist UI**: Aggressive, modern interface design
- **Real-time Updates**: Live transaction tracking and balance updates

## 🛠 Technical Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: TailwindCSS + Framer Motion
- **Web3**: Viem + Ethers.js
- **State Management**: Zustand + TanStack Query
- **Smart Contracts**: Solidity + OpenZeppelin

## 📦 Prerequisites

- Node.js 20.x or later
- Docker and Docker Compose (optional)
- MetaMask or compatible Web3 wallet
- Git

## 🔧 Installation

### Using Node.js

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/rawgas.git
   cd rawgas
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your values
   \`\`\`

4. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Using Docker

1. Build and run with Docker Compose:
   \`\`\`bash
   docker-compose up -d
   \`\`\`

2. Access the application at \`http://localhost:3000\`

## 🔐 Smart Contract Deployment

1. Set up environment variables:
   - \`DEPLOYER_PRIVATE_KEY\`: Your deployment wallet's private key
   - \`VITE_RPC_URL\`: Your Ethereum RPC URL

2. Deploy the contract:
   \`\`\`bash
   npm run deploy
   \`\`\`

3. Update the \`.env\` file with the deployed contract address

## 🔒 Security Features

1. **Signature Verification**
   - EIP-712 compliant signatures
   - Nonce management for replay protection
   - Deadline-based transaction expiration

2. **Smart Contract Security**
   - OpenZeppelin security standards
   - Comprehensive access controls
   - Event emission for all critical operations

3. **Frontend Security**
   - Secure wallet connections
   - Transaction signing validation
   - Error boundary protection

## 🌐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| VITE_CHAIN_ID | Ethereum network chain ID | Yes | 1 |
| VITE_RPC_URL | Ethereum RPC endpoint | Yes | - |
| VITE_FORWARDER_ADDRESS | Deployed forwarder contract address | Yes | - |
| DEPLOYER_PRIVATE_KEY | Private key for contract deployment | For deployment | - |
| VITE_ENABLE_TESTNETS | Enable testnet support | No | false |

## 🧪 Testing

Run the test suite:
\`\`\`bash
npm run test
\`\`\`

## 📝 Development Guidelines

1. **Code Style**
   - Follow TypeScript best practices
   - Use ESLint and Prettier configurations
   - Maintain consistent Neo-Brutalist design patterns

2. **Git Workflow**
   - Feature branches
   - Descriptive commit messages
   - Pull request reviews

3. **Testing Requirements**
   - Unit tests for all components
   - Integration tests for Web3 features
   - Contract test coverage > 95%

## 🚀 Deployment

1. **Build the application**:
   \`\`\`bash
   npm run build
   \`\`\`

2. **Using Docker**:
   \`\`\`bash
   docker build -t rawgas .
   docker run -p 3000:3000 rawgas
   \`\`\`

3. **Traditional Deployment**:
   - Deploy the \`dist\` folder to your hosting service
   - Configure environment variables
   - Set up SSL certificates

## 🔍 Monitoring

- Transaction status tracking
- Gas usage analytics
- Error reporting
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE.md for details

## 🙏 Acknowledgments

- OpenZeppelin for security standards
- Ethereum community for EIP-2771
- Neo-Brutalist design inspiration