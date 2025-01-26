# PS2 Gasless Transaction Forwarder Wallet

PS2 Gasless Transaction Forwarder is an innovative, wallet-type project designed to streamline and enhance user experiences in handling gasless transaction forwarding. Built with cutting-edge technologies, it integrates robust frontend and backend systems with seamless authentication and smart contract support.

## Features

- **Frontend**: Built with [Next.js](https://nextjs.org/) for optimized performance and scalability.
- **UI Components**: Uses [HeroUI](https://heroicons.com/) for clean and intuitive interface designs.
- **Typescript**: Ensures type safety and enhanced development workflows.
- **Backend**: Powered by [FastAPI](https://fastapi.tiangolo.com/) for fast and efficient backend operations.
- **Smart Contracts**: Developed using [Hardhat](https://hardhat.org/) for Ethereum-based blockchain interactions.
- **Authentication**: Secured using [Clerk](https://clerk.dev/) for user-friendly and secure authentication.

## Technology Stack

### Frontend
- **Framework**: Next.js
- **Component Library**: HeroUI
- **Language**: Typescript

### Backend
- **Framework**: FastAPI
- **Language**: Python

### Blockchain Contracts
- **Development Framework**: Hardhat

### Authentication
- **Provider**: Clerk

## Setup Instructions

Follow these steps to get the project up and running locally:

### Prerequisites

- Node.js v16+ and npm/yarn
- Python 3.9+
- Hardhat installed globally (`npm install -g hardhat`)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   cd ps2-gasless-transaction-forwarder-wallet
   ```

2. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Set Up Clerk Authentication**:
   - Sign up for a Clerk account at [Clerk.dev](https://clerk.dev/).
   - Create a new application and copy your API keys.
   - Add your Clerk API keys to the `.env` file in the `frontend` directory:
     ```env
     CLERK_API_KEY=<your_api_key>
     ```

5. **Configure Hardhat Contracts**:
   - Navigate to the `contracts` folder.
   - Install dependencies:
     ```bash
     npm install
     ```
   - Deploy contracts using Hardhat:
     ```bash
     npx hardhat run scripts/deploy.js --network <network_name>
     ```

6. **Start the Development Environment**:
   - **Frontend**:
     ```bash
     cd frontend
     npm run dev
     ```
   - **Backend**:
     ```bash
     cd backend
     uvicorn main:app --reload
     ```

## Usage

1. Navigate to the frontend URL (default: `http://localhost:3000`).
2. Sign up or log in using the Clerk authentication system.
3. Use the intuitive interface to forward gasless transactions securely.
4. All backend operations and blockchain interactions are handled transparently.

## Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature name'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

**Enjoy using PS2 Gasless Transaction Forwarder Wallet!** If you encounter any issues, feel free to open an issue or contribute to the project.

