import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';

// Services
import { CryptoApiService } from '../../../shared/services/api/api.service';
import { TradeService } from '../../../shared/services/trade/trade.service';
import { Trade } from '../../../shared/models/trade';

@Component({
  selector: 'app-trade-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trade-history.component.html',
  styles: []
})
export class TradeHistoryComponent {

  // Injection des services
  private apiService = inject(CryptoApiService);
  public tradeService = inject(TradeService); // Public pour accès HTML

  // Variables d'état
  currentTab: 'active' | 'history' = 'active';
  showConfirmation: boolean = false;
  isTradeCompleted: boolean = false;
  
  // Gestion de la sélection et du prix live
  selectedTradeId: string | null = null;
  selectedTrade: Trade | null = null;
  selectedTradeCurrentPrice: number | null = null;
  isLoadingPrice: boolean = false;

  // Formulaire de vente
  amountToSell: number | null = null;
  percentToSell: number | null = null;

  // --- GETTERS ---

  get filteredTrades() {
    return this.currentTab === 'active' 
      ? this.tradeService.activeTrades() 
      : this.tradeService.historyTrades();
  }

  get numberOfActiveTrades() {
    return this.tradeService.activeTrades().length;
  }

  get currentSelectedTrade() {
    return this.tradeService.trades().find(t => t.id === this.selectedTradeId);
  }

  // --- LOGIQUE D'INTERFACE ---

  setCurrentTab(tab: 'active' | 'history') {
    this.currentTab = tab;
    this.selectedTradeId = null; // Fermer la sélection au changement d'onglet
  }

  // Helper pour convertir les Timestamps Firestore en Date JS
  transformDate(date: any): Date | null {
    if (!date) return null;
    if (date instanceof Timestamp) return date.toDate();
    return new Date(date);
  }

selectTrade(trade: Trade) {
    if (this.selectedTradeId === trade.id) {
      this.selectedTradeId = null;
      this.selectedTrade = null;
      return;
    }

    this.selectedTradeId = trade.id;
    this.selectedTrade = trade;

    if (this.currentTab === 'active') {
      this.amountToSell = null;
      this.percentToSell = null;
      this.isLoadingPrice = true;
      this.selectedTradeCurrentPrice = null;

      this.apiService.getCryptoDetails(trade.cryptoId).subscribe({
        next: (data) => {
          this.selectedTradeCurrentPrice = data.market_data?.current_price?.eur || data.currentPrice;
          this.isLoadingPrice = false;
        },
        error: () => this.isLoadingPrice = false
      });
    } else {
    }
  }


  onAmountToSellChange() {
    if (!this.selectedTrade || this.amountToSell === null) {
      this.percentToSell = null;
      return;
    }
    
    // Calcul inverse : Montant -> Pourcentage
    let calculatedPercent = (this.amountToSell * 100) / this.selectedTrade.remainingAmount;
    
    // Bornes
    if (calculatedPercent > 100) {
      calculatedPercent = 100;
      this.amountToSell = this.selectedTrade.remainingAmount;
    }
    
    this.percentToSell = parseFloat(calculatedPercent.toFixed(2));
  }

  onPercentToSellChange() {
    // Note: Ajoutez (ngModelChange)="onPercentToSellChange()" dans le HTML si vous voulez l'input %
    // Cette fonction n'est pas utilisée dans votre HTML actuel mais utile à avoir
    if (!this.selectedTrade || this.percentToSell === null) {
        this.amountToSell = null;
        return;
    }

    if (this.percentToSell > 100) this.percentToSell = 100;
    
    const calculatedAmount = (this.percentToSell / 100) * this.selectedTrade.remainingAmount;
    this.amountToSell = parseFloat(calculatedAmount.toFixed(8));
  }

  onMaxAmountClick() {
    if (this.selectedTrade) {
      this.amountToSell = this.selectedTrade.remainingAmount;
      this.onAmountToSellChange(); // Recalcule le % à 100%
    }
  }

  // --- CONFIRMATION & ACTION ---

  openConfirmation(e: Event) {
    e.stopPropagation(); // Empêche de fermer la carte en cliquant sur le bouton
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
        console.log("Vente réussie");
        this.isTradeCompleted = true; // Déclenche l'animation de succès

        // Fermeture automatique après 3s
        setTimeout(() => {
          this.cancelSell();
          this.selectedTradeId = null;
          this.amountToSell = null;
          this.percentToSell = null;
        }, 3000);
      }).catch(err => {
        console.error("Erreur vente", err);
        alert("Erreur lors de la vente");
      });
    }
  }
}