import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CryptoCardComponent } from "./crypto-card/crypto-card.component";
import { CryptoCard } from '../../shared/models/crypto-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, HeaderComponent, CryptoCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
cryptos: CryptoCard[] = [
    { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 50000, change24h: 2.5, iconUrl: 'btc.png' },
    { id: '2', name: 'Solana', symbol: 'SOL', price: 150, change24h: -5.0, iconUrl: 'solana.png' },
    { id: '3', name: 'Ethereum', symbol: 'ETH', price: 3000, change24h: -5.0, iconUrl: 'eth.png' },
    { id: '4', name: 'Cardano', symbol: 'ADA', price: 0.8, change24h: 2.5, iconUrl: 'ada.png' },
    { id: '5', name: 'Binance', symbol: 'BNB', price: 550, change24h: -5.0, iconUrl: 'bnb.png' },
    // Répétez pour simuler l'effet de défilement continu
    { id: '6', name: 'Bitcoin', symbol: 'BTC', price: 50000, change24h: 2.5, iconUrl: 'btc.png' },
    { id: '7', name: 'Solana', symbol: 'SOL', price: 150, change24h: -5.0, iconUrl: 'solana.png' },
  ];
}
