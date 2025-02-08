import React from 'react';
import { Wallet, ArrowRightLeft, History, LayoutDashboard } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center justify-between border-4 border-white p-6">
          <h1 className="text-6xl font-black glitch-hover">RAWGAS</h1>
          <button className="neo-button">
            <Wallet className="inline-block mr-2" />
            Connect Wallet
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transfer Section */}
        <section className="neo-card bg-white">
          <h2 className="text-4xl font-black mb-6 flex items-center">
            <ArrowRightLeft className="mr-2" />
            TRANSFER
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-xl font-bold mb-2">Token Address</label>
              <input type="text" className="neo-input" placeholder="0x..." />
            </div>
            <div>
              <label className="block text-xl font-bold mb-2">Recipient</label>
              <input type="text" className="neo-input" placeholder="0x..." />
            </div>
            <div>
              <label className="block text-xl font-bold mb-2">Amount</label>
              <input type="number" className="neo-input" placeholder="0.0" />
            </div>
            <button type="submit" className="neo-button w-full">
              Send Gasless
            </button>
          </form>
        </section>

        {/* Dashboard Section */}
        <section className="space-y-8">
          {/* Balance Card */}
          <div className="neo-card">
            <h2 className="text-4xl font-black mb-6 flex items-center">
              <LayoutDashboard className="mr-2" />
              BALANCE
            </h2>
            <div className="text-6xl font-black">0.00 ETH</div>
          </div>

          {/* History Card */}
          <div className="neo-card">
            <h2 className="text-4xl font-black mb-6 flex items-center">
              <History className="mr-2" />
              HISTORY
            </h2>
            <div className="space-y-4">
              {/* Example Transaction */}
              <div className="border-4 border-black p-4 hover:bg-red-500 hover:text-white transition-colors">
                <div className="font-bold">To: 0x1234...5678</div>
                <div className="text-sm">Amount: 0.1 ETH</div>
                <div className="text-sm">Status: Completed</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t-4 border-white pt-6">
        <p className="text-center font-bold">
          RAWGAS © 2024 | The Neo-Brutalist Gasless Transaction Platform
        </p>
      </footer>
    </div>
  );
}

export default App;