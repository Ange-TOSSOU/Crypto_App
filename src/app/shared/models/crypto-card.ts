export interface CryptoCard {
  id: string;
  name: string;
  logo: string;
  symbol: string;
  price: number;
  change24h: number; // En pourcentage, e.g., 2.5 pour +2.5%
}