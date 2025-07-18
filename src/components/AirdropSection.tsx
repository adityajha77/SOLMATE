import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export const AirdropSection: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [amount, setAmount] = useState('1');
  const [loading, setLoading] = useState(false);

  const requestAirdrop = async () => {
    if (!publicKey) {
      toast({
        title: "No wallet connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    const solAmount = parseFloat(amount);
    if (isNaN(solAmount) || solAmount <= 0 || solAmount > 5) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount between 0.1 and 5 SOL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const lamports = solAmount * LAMPORTS_PER_SOL;
      const signature = await connection.requestAirdrop(publicKey, lamports);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature);
      
      toast({
        title: "Airdrop successful!",
        description: `${solAmount} SOL has been added to your wallet`,
      });
      
      setAmount('1');
    } catch (error) {
      console.error('Airdrop error:', error);
      toast({
        title: "Airdrop failed",
        description: "Please try again. You may have reached the rate limit.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="solmate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Request Airdrop
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="airdrop-amount">Amount (SOL)</Label>
          <Input
            id="airdrop-amount"
            type="number"
            min="0.1"
            max="5"
            step="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter SOL amount"
            className="bg-background border-border"
          />
          <p className="text-xs text-muted-foreground">
            Maximum 5 SOL per airdrop (Devnet only)
          </p>
        </div>
        
        <Button 
          onClick={requestAirdrop} 
          disabled={!publicKey || loading}
          className="w-full solmate-button"
        >
          <Gift className={`h-4 w-4 mr-2 ${loading ? 'animate-bounce' : ''}`} />
          {loading ? 'Requesting...' : 'Request Airdrop'}
        </Button>
      </CardContent>
    </Card>
  );
};