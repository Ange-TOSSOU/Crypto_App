export interface CryptoCurrency {
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