import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CryptoCardComponent } from "./crypto-card/crypto-card.component";
import { CryptoCard } from '../../shared/models/crypto-card';
import { CommonModule } from '@angular/common';
import { GrapheComponent } from "./graphe/graphe.component";
import { TopCryptosComponent } from "./top-cryptos/top-cryptos.component";
import { CryptoApiService } from '../../shared/services/api/api.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, HeaderComponent, CryptoCardComponent, GrapheComponent, TopCryptosComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  historyData: number[][] = [];
  cryptosTrending: any;

  // Périodes disponibles
  public timePeriods = [
    { label: '24H', value: '1' },      // Bougies de 30 min
    { label: '7J', value: '7' },       // Bougies de 4h
    { label: '30J', value: '30' },     // Bougies de 4h
    { label: '3M', value: '90' },  // Bougies de 4 jours
    { label: '1AN', value: '365' },   // Bougies de 4 jours
  ];

  public activePeriod: string = '30';

  constructor(private cryptoService: CryptoApiService) { }

  ngOnInit(): void {
    this.loadCryptoHistory(this.activePeriod);
    this.loadTrendingCryptos();
  }


  changePeriod(period: string) {
    this.activePeriod = period;
    this.loadCryptoHistory(period);
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


}
