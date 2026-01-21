import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CryptoCardComponent } from "./crypto-card/crypto-card.component";
import { CryptoInfo, CryptoToTrade } from '../../shared/models/crypto-info';
import { CommonModule } from '@angular/common';
import { GrapheComponent } from "./graphe/graphe.component";
import { TopCryptosComponent } from "./top-cryptos/top-cryptos.component";
import { CryptoApiService } from '../../shared/services/api/api.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { TradeComponent } from "./trade/trade.component";
import { TradeHistoryComponent } from './trade-history/trade-history.component';
import { TradeService } from '../../shared/services/trade/trade.service';
import { Trade } from '../../shared/models/trade';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, HeaderComponent, CryptoCardComponent, GrapheComponent, TopCryptosComponent, TradeComponent, TradeHistoryComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(
    private cryptoService: CryptoApiService,
    private authService: AuthService,
    private tradeService: TradeService
  ) { }

  userEmail: string = 'null';
  currentCryptoID: string = "bitcoin";
  currentCryptoDetails: any;
  cryptoToTradeInfos!: CryptoToTrade;
  historyData: number[][] = [];
  cryptosTrending: any;
  trades!: Trade[];
  
  // Périodes disponibles
  timePeriods = [
    { label: '24H', value: '1', title: "Bougies de 30 minutes" },
    { label: '7J', value: '7', title: "Bougies de 4h" },
    { label: '30J', value: '30', title: "Bougies de 4h" },
    { label: '3M', value: '90', title: "Bougies de 4 jours" },
    { label: '1AN', value: '365', title: "Bougies de 4 jours" }
  ];
  
  
  activePeriod: string = '30';
  
  
  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail() || 'null';
    this.loadCurrentCryptoDetails();
    this.loadCryptoHistory(this.activePeriod);
    this.loadTrendingCryptos();

    console.log("trades: ", this.trades);
    
  }

  changePeriod(period: string) {
    this.activePeriod = period;
    this.loadCryptoHistory(period);
  }

  loadCurrentCryptoDetails() {
    this.cryptoService.getCryptoDetails(this.currentCryptoID).subscribe({
      next: (data) => {
        this.currentCryptoDetails = data;
        console.log("details: ", this.currentCryptoDetails);
        this.cryptoToTradeInfos = {
          userid:this.currentCryptoDetails.userid,    
          name: this.currentCryptoDetails.name,
          symbol: this.currentCryptoDetails.symbol,
          price: this.currentCryptoDetails.currentPrice
        }
      }
    })
  }

  loadTrendingCryptos() {
    this.cryptoService.getCryptos(1, 10).subscribe({
      next: (data) => {
        this.cryptosTrending = data;
        console.log("Trending: ", this.cryptosTrending);
      },
      error: (err) => {
        console.error("Impossible de charger les cryptos ");

      }
    })
  }

  loadCryptoHistory(period: number | string) {
    this.cryptoService.getCryptoOHLC('bitcoin', period.toString()).subscribe({
      next: (data) => {
        this.historyData = data;
      },
      error: (err) => {
        console.error('Impossible de charger le graphe OHLC', err);
      }
    });
  }

  selectTrendingCrypto(crypto: CryptoInfo) {
    console.log(crypto);
    this.currentCryptoID = crypto.id;
    this.loadCurrentCryptoDetails();
  }

  //Pour obtenir une liste de cryptos infinie pour le scroll infini
  get infiniteCryptos() {
    return [...this.cryptosTrending, ...this.cryptosTrending];
  }
}
