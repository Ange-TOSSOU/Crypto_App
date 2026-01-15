import { Injectable } from '@angular/core';
import { TradeItem} from '../../models/crypto-info';
import { Portfolio } from '../../models/porte-folio';
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  buildPortfolio(
    trades: TradeItem[],
    prices: Record<string, number>
  ): Portfolio[] {

    const map = new Map<string, TradeItem[]>();


    trades.forEach(trade => {
      if (!map.has(trade.symbol)) {
        map.set(trade.symbol, []);
      }
      map.get(trade.symbol)!.push(trade);
    });

    // Construire chaque ligne du portefeuille
    return Array.from(map.entries()).map(([symbol, tradeList]) =>
      this.computePortfolioItem(symbol, tradeList, prices[symbol] || 0)
    );
  }

  /**
   * Calcul d’un actif du portefeuille
   */
  private computePortfolioItem(
    symbol: string,
    trades: TradeItem[],
    currentPrice: number
  ): Portfolio {

    let quantity = 0;
    let totalBuyValue = 0;
    let totalBuyAmount = 0;

    trades.forEach(trade => {
      if (trade.type === 'buy') {
        quantity += trade.amount;
        totalBuyValue += trade.totalPrice;
        totalBuyAmount += trade.amount;
      } else {
        quantity -= trade.amount;
      }
    });

    const averageBuyPrice =
      totalBuyAmount > 0 ? totalBuyValue / totalBuyAmount : 0;

    const currentValue = quantity * currentPrice;
    const invested = quantity * averageBuyPrice;

    const profitLossUsd = currentValue - invested;
    const profitLossPercent =
      invested > 0 ? (profitLossUsd / invested) * 100 : 0;

    return {
      cryptoId: symbol.toLowerCase(), // approximation
      symbol,
      quantity,
      averageBuyPrice,
      currentPrice,
      currentValue,
      profitLossUsd,
      profitLossPercent
    };
  }
}
