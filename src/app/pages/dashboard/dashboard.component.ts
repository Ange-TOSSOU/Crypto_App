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
// ✅ 1. Import nécessaire pour l'URL
import { ActivatedRoute, Router } from '@angular/router';

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
    private route: ActivatedRoute,
    private router: Router
  ) { }

  userEmail: string = 'null';
  currentCryptoID: string = "bitcoin"; // Valeur par défaut
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
    this.loadTrendingCryptos();

    this.route.queryParams.subscribe(params => {
      
      // On récupère le paramètre ?crypto=... ou 'bitcoin' si vide
      const cryptoIdFromUrl = params['crypto'];

      if (cryptoIdFromUrl) {
        this.currentCryptoID = cryptoIdFromUrl;
      } else {
        // Si pas de paramètre, on reste sur Bitcoin
        this.currentCryptoID = 'bitcoin';
      }


      this.loadCurrentCryptoDetails();
      this.loadCryptoHistory();
    });
  }

  changePeriod(period: string) {
    this.activePeriod = period;
    this.loadCryptoHistory();
  }

  loadCurrentCryptoDetails() {
    this.cryptoService.getCryptoDetails(this.currentCryptoID).subscribe({
      next: (data) => {
        this.currentCryptoDetails = data;

        this.cryptoToTradeInfos = {
          cryptoId: this.currentCryptoDetails.id,    
          name: this.currentCryptoDetails.name,
          symbol: this.currentCryptoDetails.symbol,
          price: this.currentCryptoDetails.currentPrice,
          currentPrice: this.currentCryptoDetails.currentPrice,
          logo: this.currentCryptoDetails.logo,
          change24h: this.currentCryptoDetails.change24h
        }
      }
    })
  }

  loadTrendingCryptos() {
    this.cryptoService.getCryptos(1, 10).subscribe({
      next: (data) => {
        this.cryptosTrending = data;
      },
      error: (err) => {
        console.error("Impossible de charger les cryptos ");
      }
    })
  }

  loadCryptoHistory() {
    this.cryptoService.getCryptoOHLC(this.currentCryptoID, this.activePeriod.toString()).subscribe({
      next: (data) => {
        this.historyData = data;
      },
      error: (err) => {
        console.error('Impossible de charger le graphe OHLC', err);
      }
    });
  }

  // ✅ 4. Mise à jour pour utiliser l'URL aussi
  selectTrendingCrypto(crypto: CryptoInfo) {
    // Au lieu de charger manuellement, on change juste l'URL.
    // Le ngOnInit va détecter le changement et charger les données tout seul.
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { crypto: crypto.id },
      queryParamsHandling: 'merge' // Garde les autres params s'il y en a
    });
  }

  //Pour obtenir une liste de cryptos infinie pour le scroll infini
  get infiniteCryptos() {
    // Protection si cryptosTrending n'est pas encore chargé
    if (!this.cryptosTrending) return [];
    return [...this.cryptosTrending, ...this.cryptosTrending];
  }
}