import { Component, Input, OnInit, inject } from '@angular/core'; // ✅ Ajouter inject
import { CryptoInfo, CryptoToTrade } from '../../../shared/models/crypto-info';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TradeService } from '../../../shared/services/trade/trade.service'; // ✅ Import
import { UserService } from '../../../shared/services/user/user.service';   // ✅ Import

@Component({
  selector: 'app-trade',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './trade.component.html',
  styleUrl: './trade.component.css'
})
export class TradeComponent implements OnInit {
  @Input() crypto!: CryptoToTrade;

  private tradeService = inject(TradeService);
  userService = inject(UserService); 

  showConfirmation: boolean = false;
  isTradeCompleted: boolean = false;
  isLoading: boolean = false;

  
  amountCrypto: number | null = null;
  amountFiat: number | null = null;

  ngOnInit(): void {
  }

  get currentBalance() {
    return this.userService.currentUser()?.balance || 0;
  }


  onCryptoChange() {
    if (this.amountCrypto && this.crypto.price) {
      this.amountFiat = parseFloat((this.amountCrypto * this.crypto.price).toFixed(2));
    } else {
      this.amountFiat = null;
    }
  }

  onFiatChange() {
    if (this.amountFiat && this.crypto.price) {
      this.amountCrypto = parseFloat((this.amountFiat / this.crypto.price).toFixed(6));
    } else {
      this.amountCrypto = null;
    }
  }

  useMaxBalance() {
    this.amountFiat = this.currentBalance;
    this.onFiatChange();
  }

  // --- LOGIQUE DE TRADE ---

  initiateTrade() {
    if (!this.amountCrypto || !this.amountFiat) return;
    
    if (this.amountFiat > this.currentBalance) {
      alert("Solde insuffisant !");
      return;
    }

    this.showConfirmation = true;
    this.isTradeCompleted = false;
  }

  async confirmTrade() {
    if (!this.amountCrypto || !this.crypto) return;

    this.isLoading = true; // On bloque le bouton pour éviter le double-clic

    try {
      await this.tradeService.openPosition({
        cryptoId: this.crypto.cryptoId,
        name: this.crypto.name,
        symbol: this.crypto.symbol,
        icon: this.crypto.logo, 
        buyPrice: this.crypto.price,
        initialAmount: this.amountCrypto
      });

      this.isTradeCompleted = true;

      setTimeout(() => {
        this.closeAndReset();
      }, 3000);

    } catch (error) {
      console.error("Erreur trade:", error);
      alert("Une erreur est survenue lors de la transaction.");
      this.cancelTrade(); 
    } finally {
      this.isLoading = false;
    }
  }

  cancelTrade() {
    this.showConfirmation = false;
    this.isTradeCompleted = false;
    this.isLoading = false;
  }

  private closeAndReset() {
    this.showConfirmation = false;
    this.isTradeCompleted = false;
    this.amountCrypto = null;
    this.amountFiat = null;
  }
}