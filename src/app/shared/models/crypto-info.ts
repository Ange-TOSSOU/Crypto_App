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

export interface CryptoToTrade {
  cryptoId: string;
  name: string;
  symbol: string;
  price: number;
  logo: string;
  currentPrice: number;
  change24h: number;
}
