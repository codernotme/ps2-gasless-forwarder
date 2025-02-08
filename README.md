# RAWGAS - Neo-Brutalist Web3 Gasless Transaction Platform

![RAWGAS Platform](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2232&ixlib=rb-4.0.3)

RAWGAS is a cutting-edge Web3 platform that enables gasless token transfers through a secure forwarder smart contract, wrapped in an aggressive Neo-Brutalist interface. Built with modern technologies and designed for seamless user experience.

## 🚀 Features

### Core Functionality
- **Gasless Transactions**: Execute token transfers without paying gas fees
- **Multi-Token Support**: Support for both ERC-20 and ERC-721 tokens
- **Batch Operations**: Execute multiple transfers in a single transaction
- **Real-time Price Tracking**: Live ETH price charts and token conversion
- **Transaction History**: Complete log of all user operations
- **MetaMask Integration**: Seamless wallet connection and authentication

### User Experience
- **Neo-Brutalist Design**: Bold, modern interface with high usability
- **Real-time Updates**: Live transaction tracking and balance updates
- **Token Converters**: Easy conversion between tokens and fiat
- **NFT Metadata Viewer**: View and verify NFT information
- **Mobile Responsive**: Fully functional on all device sizes

## 🛠 Technical Stack

### Frontend
- **Framework**: React + Vite + TypeScript
- **Styling**: TailwindCSS + Framer Motion
- **State Management**: Zustand + TanStack Query
- **Form Handling**: React Hook Form + Zod

### Blockchain
- **Web3 Integration**: Viem + Ethers.js
- **Contract Standards**: OpenZeppelin
- **Network Support**: Ethereum Mainnet + Testnets

### Backend & Database
- **Database**: Supabase
- **Authentication**: MetaMask + Supabase Auth
- **API Integration**: CoinGecko + OpenSea

## 📦 Prerequisites

- Node.js 20.x or later
- MetaMask or compatible Web3 wallet
- Git
- Supabase account

## 🔧 Installation

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
   \`\`\`

   Configure the following variables:
   - \`VITE_CHAIN_ID\`: Ethereum network chain ID
   - \`VITE_RPC_URL\`: Your Ethereum RPC endpoint
   - \`VITE_FORWARDER_ADDRESS\`: Deployed forwarder contract address
   - \`VITE_SUPABASE_URL\`: Your Supabase project URL
   - \`VITE_SUPABASE_ANON_KEY\`: Your Supabase anon/public key

4. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## 🗄️ Database Setup

### Supabase Configuration

1. Create a new Supabase project
2. Set up the following tables:

#### Users Table
\`\`\`sql
create table public.users (
  id uuid references auth.users primary key,
  wallet_address text unique not null,
  created_at timestamptz default now(),
  last_login timestamptz
);

-- Enable RLS
alter table public.users enable row level security;

-- Access policies
create policy "Users can read own data"
  on public.users for select
  using (auth.uid() = id);
\`\`\`

#### Transactions Table
\`\`\`sql
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_address text references public.users(wallet_address),
  transaction_hash text not null,
  type text check (type in ('ERC20', 'ERC721', 'BATCH')),
  status text check (status in ('pending', 'success', 'failed')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.transactions enable row level security;

-- Access policies
create policy "Users can read own transactions"
  on public.transactions for select
  using (auth.uid() in (
    select id from public.users where wallet_address = user_address
  ));
\`\`\`

## 🔒 Security Features

1. **Smart Contract Security**
   - OpenZeppelin security standards
   - Comprehensive access controls
   - Emergency pause functionality
   - Gas price limits

2. **Frontend Security**
   - Secure wallet connections
   - Transaction signing validation
   - Rate limiting
   - Error boundary protection

3. **Database Security**
   - Row Level Security (RLS)
   - Secure authentication flow
   - Data encryption
   - Access policies

## 📊 Monitoring & Analytics

- Transaction success rates
- Gas usage metrics
- User activity tracking
- Error reporting
- Performance monitoring

## 🚀 Deployment

1. Build the application:
   \`\`\`bash
   npm run build
   \`\`\`

2. Deploy to your hosting service:
   - Upload the \`dist\` folder
   - Configure environment variables
   - Set up SSL certificates

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
   - Unit tests for components
   - Integration tests for Web3 features
   - Contract test coverage > 95%

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
- Supabase team for backend infrastructure
- Neo-Brutalist design inspiration

## 📞 Support

For support, please:
1. Check the [Issues](https://github.com/yourusername/rawgas/issues) page
2. Join our [Discord community](https://discord.gg/rawgas)
3. Email support at support@rawgas.io