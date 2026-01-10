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

  isBuying: boolean = true; //false pour acheter et true pour vendre
  showConfirmation: boolean = false;
  isTradeCompleted: boolean = false;

  userBalanceEur: number = 2500.50; // Il a 2500€
  userBalanceCrypto: number = 0.45; // Il a 0.45 de la crypto actuelle

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

  setBuying(buying: boolean) {
    this.isBuying = buying;
  }

  //Au click du bouton Acheter/Vendre
  initiateTrade(){
    if(!this.amountCrypto) return;
    this.showConfirmation = true;
    this.isTradeCompleted = false;
  }

  confirmTrade(){
    this.isTradeCompleted = true;

    console.log("click: ", this.isTradeCompleted);
    
    setTimeout(() =>{
      this.closeAndReset();
    }, 3000)
  }

  private closeAndReset(){
    this.showConfirmation = false;
    this.isTradeCompleted = false;

    this.amountCrypto = null;
    this.amountFiat = null;
  }

  cancelTrade(){
    this.showConfirmation = false;
    this.isTradeCompleted = false;
  }

  get actionText() {
    return this.isBuying ? `Acheter ${this.crypto.name}` : `Vendre ${this.crypto.name}`
  }

  useMaxBalance() {
  if (this.isBuying) {
    // Achat : On met tous les Euros
    this.amountFiat = this.userBalanceEur;
    this.onFiatChange(); // Recalcule la crypto
  } else {
    // Vente : On vend toute la Crypto
    this.amountCrypto = this.userBalanceCrypto;
    this.onCryptoChange(); // Recalcule les euros
  }
}
}
