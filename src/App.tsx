import React, { useState } from 'react';
import { Wallet, ArrowRightLeft, History, LayoutDashboard, Image, Layers, LineChart as ChartLine } from 'lucide-react';
import { TransactionStatus } from './components/TransactionStatus';
import { TokenTransferForm } from './components/TokenTransferForm';
import { NFTTransferForm } from './components/NFTTransferForm';
import { BatchTransferForm } from './components/BatchTransferForm';
import { TokenConverter } from './components/TokenConverter';
import { NFTConverter } from './components/NFTConverter';
import { PriceChart } from './components/PriceChart';
import { UserHistory } from './components/UserHistory';
import { useWeb3Store } from './store/web3Store';
import { useAuth } from './hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { address, balance, connect, isConnecting } = useWeb3Store();
  const [activeTab, setActiveTab] = useState<'erc20' | 'erc721' | 'batch'>('erc20');
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(null);
  
  // Initialize authentication
  useAuth();

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 md:mb-12">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between border-4 border-white p-4 md:p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-black glitch-hover mb-4 md:mb-0">RAWGAS</h1>
          <button 
            className="neo-button w-full md:w-auto"
            onClick={() => connect()}
            disabled={isConnecting}
          >
            <Wallet className="inline-block mr-2" />
            {isConnecting ? 'Connecting...' : address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
          </button>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Transfer Section */}
          <section className="neo-card">
            <div className="flex space-x-4 mb-6">
              <button
                className={`neo-tab ${activeTab === 'erc20' ? 'active' : ''}`}
                onClick={() => setActiveTab('erc20')}
              >
                <ArrowRightLeft className="mr-2" />
                ERC-20
              </button>
              <button
                className={`neo-tab ${activeTab === 'erc721' ? 'active' : ''}`}
                onClick={() => setActiveTab('erc721')}
              >
                <Image className="mr-2" />
                NFT
              </button>
              <button
                className={`neo-tab ${activeTab === 'batch' ? 'active' : ''}`}
                onClick={() => setActiveTab('batch')}
              >
                <Layers className="mr-2" />
                Batch
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'erc20' && (
                  <TokenTransferForm onSuccess={setTransactionHash} />
                )}
                {activeTab === 'erc721' && (
                  <NFTTransferForm onSuccess={setTransactionHash} />
                )}
                {activeTab === 'batch' && (
                  <BatchTransferForm onSuccess={setTransactionHash} />
                )}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* Converters */}
          <TokenConverter />
          <NFTConverter />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Balance Card */}
          <motion.div 
            className="neo-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-black mb-6 flex items-center">
              <LayoutDashboard className="mr-2" />
              BALANCE
            </h2>
            <div className="text-6xl font-black">{balance} ETH</div>
          </motion.div>

          {/* Price Chart */}
          <PriceChart />

          {/* Transaction Status */}
          {transactionHash && (
            <motion.div 
              className="neo-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-black mb-6 flex items-center">
                <History className="mr-2" />
                TRANSACTION
              </h2>
              <TransactionStatus hash={transactionHash} />
            </motion.div>
          )}

          {/* User History */}
          <UserHistory />
        </div>
      </main>

      {/* Guide Section */}
      <section className="mt-12 neo-card">
        <h2 className="text-4xl font-black mb-6">GUIDE</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">Getting Started</h3>
            <p>1. Connect your MetaMask wallet using the button in the header</p>
            <p>2. Choose between ERC-20, NFT, or Batch transfers</p>
            <p>3. Use the converters to check token values</p>
            <p>4. Monitor your transaction history and gas prices</p>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-2">Features</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Gasless Transactions: Transfer tokens without paying gas fees</li>
              <li>Token Conversion: Real-time price calculations</li>
              <li>NFT Support: Transfer and view NFT metadata</li>
              <li>Batch Operations: Multiple transfers in one transaction</li>
              <li>Transaction History: Track all your operations</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-2">Security</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>MetaMask Authentication: Secure wallet connection</li>
              <li>Transaction Signing: All operations require your approval</li>
              <li>Gas Price Protection: Prevents high gas fee transactions</li>
              <li>Real-time Monitoring: Track transaction status</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t-4 border-white pt-6">
        <p className="text-center font-bold">
          RAWGAS © 2025 | The Neo-Brutalist Gasless Transaction Platform
        </p>
      </footer>
    </div>
  );
}

export default App;