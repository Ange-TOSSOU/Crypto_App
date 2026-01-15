    export interface CryptoInfo {
      id: string;
      name: string;
      symbol: string;
      logo: string;
      price: number;
      change24h: number;
      change7d: number;
      marketCap: number;
      volume: number;
    }

  export  interface CryptoToTrade{
  userid:string;
  name: string;
  symbol: string;
  price: number;
}

export interface TradeItem {
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