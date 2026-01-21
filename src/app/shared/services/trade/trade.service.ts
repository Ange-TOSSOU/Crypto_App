import { computed, Injectable, signal } from '@angular/core';
import { Trade } from '../../models/trade';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  constructor() {
    this.loadTrades();
  }

  private _trades = signal<Trade[]>([]);

  trades = this._trades.asReadonly();

  activeTrades = computed(() =>
    this._trades().filter(trade => trade.status === "open"))

  historyTrades = computed(() =>
    this._trades()
      .filter(t => t.status === 'closed')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Tri par date décroissante
  );

  loadTrades() {
    //Importez les trades de la base de données
    this._trades.set([
      {
        id: 't-btc-001',
        cryptoId: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        status: 'open',
        buyPrice: 42000,        // Acheté à 42k
        initialAmount: 0.5,     // 0.5 BTC au départ
        remainingAmount: 0.5,   // Toujours 0.5 BTC
        date: new Date('2024-01-10T14:30:00'),
        realisedPnl: 0          // Pas encore de gain encaissé
      },

      // 2. ETHEREUM - Position partiellement vendue (Prise de profit)
      // Scénario : Achat de 10 ETH, vente de 4 ETH. Il en reste 6.
      {
        id: 't-eth-002',
        cryptoId: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        status: 'open',
        buyPrice: 2100,
        initialAmount: 10,
        remainingAmount: 6,     // Il en reste 6
        date: new Date('2023-12-15T09:00:00'),
        realisedPnl: 1200       // On a déjà gagné 1200€ sur la partie vendue
      },

      // 3. SOLANA - Position ouverte récente
      // Scénario : Petit achat spéculatif
      {
        id: 't-sol-003',
        cryptoId: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        status: 'open',
        buyPrice: 95.50,
        initialAmount: 50,
        remainingAmount: 50,
        date: new Date(),       // Date d'aujourd'hui
        realisedPnl: 0
      },

      // 4. RIPPLE (XRP) - Position Clôturée (Succès)
      // Scénario : Tout a été vendu avec un beau profit
      {
        id: 't-xrp-004',
        cryptoId: 'ripple',
        name: 'XRP',
        symbol: 'XRP',
        icon: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
        status: 'closed',
        buyPrice: 0.45,
        initialAmount: 2000,
        remainingAmount: 0,     // Tout est parti
        date: new Date('2023-11-20T10:15:00'),
        realisedPnl: 450        // Gain final encaissé : 450€
      },

      // 5. DOGECOIN - Position Clôturée (Perte/Stop Loss)
      // Scénario : Achat impulsif, revendu à perte pour limiter la casse
      {
        id: 't-doge-005',
        cryptoId: 'dogecoin',
        name: 'Dogecoin',
        symbol: 'DOGE',
        icon: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
        status: 'closed',
        buyPrice: 0.18,
        initialAmount: 5000,
        remainingAmount: 0,
        date: new Date('2023-10-05T16:45:00'),
        realisedPnl: -150       // Perte sèche de 150€
      }]
    )
  }

  openPosition(tradeInfo: Omit<Trade, 'id' | 'status' | 'remainingAmount' | 'realisedPnl'>) {
    const newTrade: Trade = {
      ...tradeInfo,
      id: crypto.randomUUID(),
      status: "open",
      remainingAmount: tradeInfo.initialAmount,
      realisedPnl: 0
    }

    this._trades.update((current) => [newTrade, ...current])
  }

  sellPosition(tradeId: string, sellAmount: number, sellPrice?: number) {
    this._trades.update((currentTrades) => {
      return currentTrades.map(trade => {
        if (trade.id === tradeId) {
          if (sellAmount > trade.remainingAmount) {
            console.error("Erreur lors de la vente: Tentative de vente supérieure au solde");
            return trade;
          }

          const newRemaining = trade.remainingAmount - sellAmount;
          // Si le reste est minuscule (poussière de crypto), on considère que c'est 0
          const isClosed = newRemaining < 0.00000001;

          let profit = 0;

          if (sellPrice) {
            profit = (sellPrice - trade.buyPrice) * sellAmount;
          }

          return {
            ...trade,
            remainingAmount: isClosed ? 0 : newRemaining,
            status: isClosed ? 'closed' : 'open',
            realisedPnl: (trade.realisedPnl || 0) + profit
          }
        }
        return trade;
      })
    })
  }

  deleteTrade(tradeId: string) {
    this._trades.update(currentTrades => currentTrades.filter(trade => trade.id !== tradeId));
  }
}
