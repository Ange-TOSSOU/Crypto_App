import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoApiService } from '../../../shared/services/api/api.service';
import { CryptoInfo } from '../../../shared/models/crypto-info';
import { ShortNumberPipe } from '../../../shared/pipes/short-number/short-number.pipe';

@Component({
  selector: 'app-top-cryptos',
  standalone: true,
  imports: [CommonModule, ShortNumberPipe], 
  templateUrl: './top-cryptos.component.html',
  styleUrl: './top-cryptos.component.css'
})
export class TopCryptosComponent implements OnInit {
  
  cryptos: CryptoInfo[] = [];
  
  currentPage: number = 1;
  itemsPerPage: number = 50; 

  // ✅ Événement pour prévenir le Dashboard quand on clique sur une ligne
  @Output() selectCrypto = new EventEmitter<CryptoInfo>();

  constructor(private cryptoService: CryptoApiService) {}

  ngOnInit(): void {
    this.loadCryptos();
  }

  loadCryptos(): void {
    this.cryptoService.getCryptos(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        this.cryptos = data;
      },
      error: (err) => console.error(err)
    });
  }

  onRowClick(crypto: CryptoInfo) {
    this.selectCrypto.emit(crypto);
  }
}