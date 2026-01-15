export interface Portfolio {
  cryptoId: string;
  symbol: string;

  quantity: number;
  averageBuyPrice: number;

  currentPrice: number;
  currentValue: number;

  profitLossUsd: number;
  profitLossPercent: number;
}
