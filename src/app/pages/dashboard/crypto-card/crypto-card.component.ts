import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CryptoCard } from '../../../shared/models/crypto-card';
import { CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-crypto-card',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './crypto-card.component.html',
  styleUrl: './crypto-card.component.css'
})
export class CryptoCardComponent {
  @Input() crypto!: CryptoCard;
  
}
