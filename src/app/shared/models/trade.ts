export interface Trade {
  id: number;
  userid:string;
  type: 'buy' | 'sell'; // Pour gérer la couleur
  status: 'open' | 'closed';
  symbol: string;
  name: string;
  amount: number;
  totalPrice: number;   // Combien ça a coûté en €
  date: Date;           // Date de la transaction
  icon: string;         // Logo de la crypto
}