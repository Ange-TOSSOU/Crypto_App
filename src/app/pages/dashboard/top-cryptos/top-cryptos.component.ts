import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important pour *ngFor, *ngIf, pipe currency
import { CryptoApiService } from '../../../shared/services/api/api.service';
import { CryptoCurrency } from '../../../shared/models/crypto-currency';
import { ShortNumberPipe } from '../../../shared/pipes/short-number/short-number.pipe';

@Component({
  selector: 'app-top-cryptos',
  standalone: true,
  imports: [CommonModule, ShortNumberPipe], 
  templateUrl: './top-cryptos.component.html',
  styleUrl: './top-cryptos.component.css'
})
export class TopCryptosComponent implements OnInit {
  
  cryptos: CryptoCurrency[] = [];
  
  currentPage: number = 1;
  itemsPerPage: number = 5; 

  constructor(private cryptoService: CryptoApiService) {}

  ngOnInit(): void {
    this.loadCryptos();
    console.log(this.cryptos);
  }

  loadCryptos(): void {
    this.cryptoService.getCryptos(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        console.log('Données reçues :', data);
        this.cryptos = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des cryptos :', err);
      }
    });
  }

  nextPage(): void {
    this.currentPage++;
    this.loadCryptos();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCryptos();
    }
  }
}