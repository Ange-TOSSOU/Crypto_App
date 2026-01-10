import { Component, Input, OnInit } from '@angular/core';
import { CryptoToTrade } from '../../../shared/models/crypto-info';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trade',
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './trade.component.html',
  styleUrl: './trade.component.css'
})
export class TradeComponent implements OnInit {
  @Input() crypto!: CryptoToTrade;

  isBuying: boolean = false; //false pour acheter et true pour vendre

  amountCrypto: number | null = null; //La quantité de crypto à trader
  amountFiat: number | null = null; //La quantité de monnaie à utiliser pour le trade

  ngOnInit(): void {
    console.log("crypto to trade: ", this.crypto);
  }

  onCryptoChange() {
    if (this.amountCrypto && this.crypto.price) {
      this.amountFiat = parseFloat((this.amountCrypto * this.crypto.price).toFixed(2));
    }
    else
      this.amountFiat = null;
  }

  onFiatChange() {
    if (this.amountFiat && this.crypto.price) {
      this.amountCrypto = parseFloat((this.amountFiat / this.crypto.price).toFixed(6));
    }
    else
      this.amountCrypto = null;
  }

  setTrading(buying: boolean) {
    this.isBuying = buying;
  }

  get actionText() {
    return this.isBuying ? `Vendre ${this.crypto.name}` : `Acheter ${this.crypto.name}`
  }
}
