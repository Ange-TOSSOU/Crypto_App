export interface Trade {
  id: string;
  cryptoId: string; //bitcoin
  name: string;
  symbol: string;
  icon: string;
  status: 'open' | 'closed';
  buyPrice: number;
  initialAmount: number; //nombre de cryptos achetées
  remainingAmount: number; //la quantité actuelle restante
  date: Date;
  realisedPnl?: number; //Gain
}