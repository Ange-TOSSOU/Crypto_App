import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trade } from '../../../shared/models/trade';
import { FormsModule } from '@angular/forms';
import { CryptoApiService } from '../../../shared/services/api/api.service';
import { TradeService } from '../../../shared/services/trade/trade.service';
import { UserService } from '../../../shared/services/user/user.service';

@Component({
  selector: 'app-trade-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trade-history.component.html',
  styles: []
})
export class TradeHistoryComponent {

  apiService = inject(CryptoApiService);
  tradeService = inject(TradeService);
  userService = inject(UserService);


  currentTab: 'active' | 'history' = 'active';
  showConfirmation: boolean = false;
  isTradeCompleted: boolean = false;
  isLoadingPrice: boolean = false;
  selectedTrade: Trade | null = null;
  selectedTradeId: string | null = null;
  selectedTradeCurrentPrice: number | null = null;
  amountToSell: number | null = null;
  percentToSell: number | null = null;

  get trades() {
    return this.tradeService.trades();
  }

  get filteredTrades() {
    if (this.currentTab === 'active') {
      return this.tradeService.activeTrades();
    }
    else {
      return this.tradeService.historyTrades();
    }
  }

  get numberOfActiveTrades() {
    return this.tradeService.activeTrades().length;
  }

  setCurrentTab(tab: 'active' | 'history') {
    this.currentTab = tab;
    this.selectedTradeId = null;
  }

  selectTrade(trade: Trade) {
    if (this.currentTab === 'active') {

      // 1. Logique d'ouverture/fermeture (Toggle)
      if (this.selectedTradeId === trade.id) {
        // Si on clique sur le même, on ferme tout
        this.selectedTradeId = null;
        this.selectedTrade = null;
        this.selectedTradeCurrentPrice = null; // On reset le prix
      } else {
        // 2. Si on ouvre un nouveau trade
        this.selectedTradeId = trade.id;
        this.selectedTrade = trade;
        this.amountToSell = null;
        this.percentToSell = null;

        // 3. ON RÉCUPÈRE LE PRIX EN DIRECT
        this.isLoadingPrice = true;
        this.selectedTradeCurrentPrice = null; 

        this.apiService.getCryptoDetails(trade.cryptoId).subscribe({
          next: (data) => {
            this.selectedTradeCurrentPrice = data.currentPrice;
            this.isLoadingPrice = false;
          },
          error: () => this.isLoadingPrice = false
        });
      }
    }
  }

  onAmountToSellChange() {

    if (!this.selectedTrade) return;

    if (this.amountToSell !== null && this.amountToSell !== undefined) {

      let calculatedPercent = (this.amountToSell * 100) / this.selectedTrade.remainingAmount;

      if (calculatedPercent > 100) {
        calculatedPercent = 100;
        this.amountToSell = this.selectedTrade.remainingAmount;
      }

      this.percentToSell = parseFloat(calculatedPercent.toFixed(2));

    } else {
      this.percentToSell = null;
    }
  }

  onMaxAmountClick() {
    if (this.selectedTrade) {
      this.amountToSell = this.selectedTrade.remainingAmount;
      this.onAmountToSellChange();
    }
  }

  openConfirmation(e: Event) {
    e.stopPropagation();

    if (!this.amountToSell || !this.selectedTradeId) return;

    this.showConfirmation = true;
    this.isTradeCompleted = false;
  }

  cancelSell() {
    this.showConfirmation = false;
    this.isTradeCompleted = false;
  }

confirmSell() {
    if (this.selectedTradeId && this.amountToSell && this.selectedTradeCurrentPrice) {
      
      this.tradeService.sellPosition(
        this.selectedTradeId, 
        this.amountToSell, 
        this.selectedTradeCurrentPrice
      ).then(() => {
        console.log("Vente réussie !");
        this.isTradeCompleted = true;
        setTimeout(() => this.cancelSell(), 3000);
      }).catch(err => {
        console.error("Erreur vente:", err);
      });
    }
  }
  get currentSelectedTrade() {
    return this.trades.find(t => t.id === this.selectedTradeId);
  }
}