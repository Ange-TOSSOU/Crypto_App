import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeItem } from '../../../shared/models/crypto-info';

@Component({
  selector: 'app-trade-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trade-history.component.html',
  styles: []
})
export class TradeHistoryComponent {

  @Input() trades!: TradeItem[];
  currentTab: 'active' | 'history' = 'active';
  selectedTradeId: number = -1;

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

  selectTrade(trade: TradeItem) {
    if (this.currentTab === 'active') {
      this.selectedTradeId = this.selectedTradeId === trade.id ? -1 : trade.id;
    }
  }

}