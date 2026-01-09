import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CryptoInfo } from '../../../shared/models/crypto-info';
import { CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-crypto-card',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './crypto-card.component.html',
  styleUrl: './crypto-card.component.css'
})
export class CryptoCardComponent {
  @Input() crypto!: CryptoInfo;
  
}
