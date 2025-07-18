import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SendTransactionProps {
  onTransactionSuccess: (signature: string, amount: number, recipient: string) => void;
}

export const SendTransaction: React.FC<SendTransactionProps> = ({ onTransactionSuccess }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendTransaction = async () => {
    if (!publicKey) {
      toast({
        title: "No wallet connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    const solAmount = parseFloat(amount);
    if (isNaN(solAmount) || solAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    try {
      new PublicKey(recipient);
    } catch (error) {
      toast({
        title: "Invalid recipient address",
        description: "Please enter a valid Solana address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const lamports = solAmount * LAMPORTS_PER_SOL;
      const recipientPubkey = new PublicKey(recipient);
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature);
      
      toast({
        title: "Transaction successful!",
        description: `Sent ${solAmount} SOL successfully`,
      });
      
      onTransactionSuccess(signature, solAmount, recipient);
      setAmount('');
      setRecipient('');
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Transaction failed",
        description: "Please check your balance and try again",
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
          <Send className="h-5 w-5 text-primary" />
          Send SOL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter Solana address"
            className="bg-background border-border"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="send-amount">Amount (SOL)</Label>
          <Input
            id="send-amount"
            type="number"
            min="0.001"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter SOL amount"
            className="bg-background border-border"
          />
        </div>
        
        <Button 
          onClick={handleSendTransaction} 
          disabled={!publicKey || loading || !recipient || !amount}
          className="w-full solmate-button"
        >
          <Send className={`h-4 w-4 mr-2 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? 'Sending...' : 'Send Transaction'}
        </Button>
      </CardContent>
    </Card>
  );
};