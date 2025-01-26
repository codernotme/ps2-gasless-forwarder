"use client";

import { Card } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Wallet2, ArrowUpRight, Clock, Coins, Users } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";
import TransactionHistory from "@/components/TransactionHistory";
import { WalletButton } from "@/components/WalletButton";
import { NetworkSelector } from "@/components/NetworkSelector";
import { Toaster } from "@/components/ui/toaster";

/**
 * Home Page Component
 * Main dashboard for the gasless forwarder application
 * Features:
 * - Network selection and wallet connection
 * - Transaction statistics
 * - Transaction form for token transfers
 * - Transaction history
 * - Recent activity sidebar
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet2 className="h-6 w-6" />
            <h1 className="text-xl font-bold">Gasless Forwarder</h1>
          </div>
          <div className="flex items-center gap-4">
            <NetworkSelector />
            <WalletButton />
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ArrowUpRight className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <h3 className="text-2xl font-bold">1,234</h3>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Coins className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gas Saved (ETH)</p>
                <h3 className="text-2xl font-bold">45.23</h3>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Txs</p>
                <h3 className="text-2xl font-bold">5</h3>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <h3 className="text-2xl font-bold">256</h3>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main Transaction Interface */}
          <div className="md:col-span-3">
            <Card className="p-6">
              <Tabs 
                variant="bordered" 
                size="md" 
                fullWidth 
                classNames={{
                  base: "w-full",
                  tabList: "grid grid-cols-2",
                  tab: "flex-1"
                }}
              >
                <Tab key="send" title="Send Transaction">
                  <TransactionForm />
                </Tab>
                <Tab key="history" title="Transaction History">
                  <TransactionHistory />
                </Tab>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar Components */}
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 pb-3 border-b last:border-0">
                    <div className="p-2 bg-muted rounded-full">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Transaction {i}</p>
                      <p className="text-xs text-muted-foreground">2 mins ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Network Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Gas Price</span>
                  <span className="text-sm font-medium">25 Gwei</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Block Number</span>
                  <span className="text-sm font-medium">#18245633</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  );
}