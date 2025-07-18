import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletProvider } from '@/components/WalletProvider';
import { WalletBalance } from '@/components/WalletBalance';
import { AirdropSection } from '@/components/AirdropSection';
import { SendTransaction } from '@/components/SendTransaction';
import { TransactionHistory } from '@/components/TransactionHistory';
import { Wallet } from 'lucide-react';

interface Transaction {
  signature: string;
  amount: number;
  recipient: string;
  timestamp: Date;
}

const SolmateApp = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleTransactionSuccess = (signature: string, amount: number, recipient: string) => {
    const newTransaction: Transaction = {
      signature,
      amount,
      recipient,
      timestamp: new Date(),
    };
    setTransactions(prev => [newTransaction, ...prev].slice(0, 10)); // Keep only last 10 transactions
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold solmate-title">
                SOLMATE
              </h1>
            </div>
            <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !rounded-lg" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Your Solana Wallet Companion
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect your wallet, request airdrops, send SOL, and track your transactions all in one place.
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <WalletBalance />
              <AirdropSection />
            </div>

            {/* Middle Column */}
            <div className="space-y-6">
              <SendTransaction onTransactionSuccess={handleTransactionSuccess} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <TransactionHistory transactions={transactions} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Developed by <span className="text-primary font-semibold">Aditya Jha</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <WalletProvider>
      <SolmateApp />
    </WalletProvider>
  );
};

export default Index;
