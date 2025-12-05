import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CryptoCardComponent } from "./crypto-card/crypto-card.component";
import { CryptoCard } from '../../shared/models/crypto-card';
import { CommonModule } from '@angular/common';
import { GrapheComponent } from "./graphe/graphe.component";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, HeaderComponent, CryptoCardComponent, GrapheComponent],
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

  mockChartData: number[][] = [
  // [Timestamp en millisecondes, Prix]
  
  // Jour 1: Début (Prix bas)
  [Date.now() - (6 * 24 * 60 * 60 * 1000), 28000.00], 
  
  // Jour 2: Montée
  [Date.now() - (5 * 24 * 60 * 60 * 1000), 30500.50],
  
  // Jour 3: Pic
  [Date.now() - (4 * 24 * 60 * 60 * 1000), 32100.25],
  
  // Jour 4: Baisse significative
  [Date.now() - (3 * 24 * 60 * 60 * 1000), 29500.75],
  
  // Jour 5: Stabilisation
  [Date.now() - (2 * 24 * 60 * 60 * 1000), 29750.10],
  
  // Jour 6: Nouvelle Montée
  [Date.now() - (1 * 24 * 60 * 60 * 1000), 31250.00],
  
  // Jour 7: Prix Actuel (Prix élevé)
  [Date.now(), 31800.99]
];
}
