import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trade } from '../../../shared/models/trade';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trade-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trade-history.component.html',
  styles: []
})
export class TradeHistoryComponent {

  @Input() trades!: Trade[];
  currentTab: 'active' | 'history' = 'active';
  showConfirmation: boolean = false;
  isTradeCompleted: boolean = false;

  selectedTradeId: number = -1;
  amountToSell: number | null = null;
  percentToSell: number | null = null;
  get filteredTrades() {
    if (this.currentTab === 'active') {
      return this.trades.filter(trade => trade.status === 'open');
    }
    else {
      return this.trades.filter(trade => trade.status === 'closed');
    }
  }

  setCurrentTab(tab: 'active' | 'history') {
    this.currentTab = tab;
  }

  selectTrade(trade: Trade) {
    if (this.currentTab === 'active') {
      this.selectedTradeId = this.selectedTradeId === trade.id ? -1 : trade.id;
      this.amountToSell = null;
      this.percentToSell = null;      
    }
  }

  onAmountToSellChange() {
    const currentTrade = this.trades.find(trade => trade.id === this.selectedTradeId);

    if (!currentTrade) return;

    if (this.amountToSell !== null && this.amountToSell !== undefined) {

      let calculatedPercent = (this.amountToSell * 100) / currentTrade.amount;

      if (calculatedPercent > 100) {
        calculatedPercent = 100;
        this.amountToSell = currentTrade.amount;
      }

      this.percentToSell = parseFloat(calculatedPercent.toFixed(2));

    } else {
      this.percentToSell = null;
    }
  }

  openConfirmation(e: Event){
    e.stopPropagation();

    if(!this.amountToSell || !this.selectedTradeId) return;

    this.showConfirmation = true;
    this.isTradeCompleted = false;
  }

  cancelSell(){
    this.showConfirmation = false;
    this.isTradeCompleted = false;
  }

  confirmSell() {
    if (this.selectedTradeId && this.amountToSell) {
      //  this.tradeService.sellPosition(this.selectedTradeId, this.amountToSell);
      console.log("Sell");
    }

    this.isTradeCompleted = true;

    setTimeout(() => {
      this.cancelSell(); 
      this.selectedTradeId = -1;
      this.amountToSell = null; 
      this.percentToSell = null;  
    }, 3000);
  }
get currentSelectedTrade() {
    return this.trades.find(t => t.id === this.selectedTradeId);
  }
}