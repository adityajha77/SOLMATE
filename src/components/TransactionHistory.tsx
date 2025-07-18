import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Transaction {
  signature: string;
  amount: number;
  recipient: string;
  timestamp: Date;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const openInExplorer = (signature: string) => {
    window.open(`https://explorer.solana.com/tx/${signature}?cluster=devnet`, '_blank');
  };

  return (
    <Card className="solmate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No transactions yet
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <div 
                key={tx.signature} 
                className="glass-effect rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    -{tx.amount} SOL
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {tx.timestamp.toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm">
                    <span className="text-muted-foreground">To: </span>
                    <span className="font-mono text-xs break-all">
                      {tx.recipient.slice(0, 8)}...{tx.recipient.slice(-8)}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Signature: </span>
                    <span className="font-mono text-xs break-all">
                      {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openInExplorer(tx.signature)}
                  className="w-full mt-2"
                >
                  <ExternalLink className="h-3 w-3 mr-2" />
                  View in Explorer
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};