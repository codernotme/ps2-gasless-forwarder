# PS2: Glass Forwarder Wallet

PS2 Glass Forwarder is an innovative, wallet-type project designed to streamline and enhance user experiences in handling glass-forwarding transactions. Built with cutting-edge technologies, it integrates robust frontend and backend systems with seamless smart contract support.

## Features

- Frontend: Built with [Next.js](https://nextjs.org/) for optimized performance and scalability.
- UI Components: Uses [HeroUI](https://heroicons.com/) for clean and intuitive interface designs.
- Typescript: Ensures type safety and enhanced development workflows.
- Backend: Powered by [FastAPI](https://fastapi.tiangolo.com/) for fast and efficient backend operations.
- Smart Contracts: Developed using [Hardhat](https://hardhat.org/) for Ethereum-based blockchain interactions.

## Technology Stack

### Frontend
- Framework: Next.js
- Component Library: HeroUI
- Language: Typescript

### Backend
- Framework: FastAPI
- Language: Python

### Blockchain Contracts
- Development Framework: Hardhat

## Setup Instructions

Follow these steps to get the project up and running locally:

### Prerequisites

- Node.js v16+ and npm/yarn
- Python 3.9+
- Docker and Docker Compose installed
- Hardhat installed globally (npm install -g hardhat)

### Installation

1. Clone the Repository:
   bash
   git clone <repository_url>
   cd ps2-glass-forwarder-wallet
   

2. Install Frontend Dependencies:
   bash
   cd frontend
   npm install
   

3. Install Backend Dependencies:
   bash
   cd backend
   pip install -r requirements.txt
   

4. Configure Hardhat Contracts:
   - Navigate to the contracts folder.
   - Install dependencies:
     bash
     npm install
     
   - Deploy contracts using Hardhat:
     bash
     npx hardhat run scripts/deploy.js --network <network_name>
     

5. Set Up the Docker Environment:
   - Navigate to the root directory.
   - Use Docker Compose to build and start the development environment:
     bash
     docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
     

## Usage

1. Navigate to the frontend URL (default: http://localhost:3000).
2. Use the intuitive interface to forward glass transactions securely.
3. All backend operations and blockchain interactions are handled transparently.

## Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a feature branch: git checkout -b feature-name.
3. Commit your changes: git commit -m 'Add feature name'.
4. Push to the branch: git push origin feature-name.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

Enjoy using PS2 Glass Forwarder Wallet! If you encounter any issues, feel free to open an issue or contribute to the project.

env
```bash
Network Configuration
INFURA_API_KEY= 
PRIVATE_KEY=0592726a8f441cc3f187a3bf3c107f1beac8da5285e0202f0f7be4334bdc3055

Network RPCs
MAINNET_RPC=https://mainnet.infura.io/v3/your-infura-key
GOERLI_RPC=https://goerli.infura.io/v3/your-infura-key
POLYGON_RPC=https://polygon-mainnet.infura.io/v3/your-infura-key

Verification
ETHERSCAN_API_KEY=AFQJGIPIQFDAPNN5U2J2GUBAD6HD1DM4MF
POLYGONSCAN_API_KEY=R5ZPD8D94WX59B7DR1NGNVTYSJMBJPKTBH

ERC20_CONTRACT_ADDRESS=YCT2A9SX6U3WSK2II44J9T5VEYWCKGH5WV
ERC721_CONTRACT_ADDRESS=YCT2A9SX6U3WSK2II44J9T5VEYWCKGH5WV
```
