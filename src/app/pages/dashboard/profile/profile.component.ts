import { Component, inject, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { updatePassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { UserService } from '../../../shared/services/user/user.service';
import { TradeService } from '../../../shared/services/trade/trade.service';
import { CryptoApiService } from '../../../shared/services/api/api.service';

// Interface locale pour l'affichage (agrégé)
interface CryptoAsset {
  id: string; // Utile pour l'appel API
  name: string;
  symbol: string;
  amount: number;
  currentPrice: number; // Prix du marché actuel
  icon: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  // --- SERVICES ---
  public authService = inject(AuthService);
  public userService = inject(UserService);
  private tradeService = inject(TradeService); // Pour les trades
  private apiService = inject(CryptoApiService); // Pour le prix live
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // --- DONNÉES ---
  resetForm: FormGroup;
  updateForm: FormGroup;
  
  portfolio: CryptoAsset[] = [];
  totalValue: number = 0;

  constructor() {
    // 1. Init Formulaire Password
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // 2. Init Formulaire Profil
    this.updateForm = this.fb.group({
      newLastName: ['', [Validators.required, Validators.minLength(2)]],
      newFirstName: ['', [Validators.required, Validators.minLength(2)]]
    });

    // 3. EFFET : Pré-remplissage du profil (User -> Form)
    effect(() => {
      const user = this.userService.currentUser();
      if (user) {
        this.updateForm.patchValue({
          newLastName: user.lastName,
          newFirstName: user.firstName
        }, { emitEvent: false });
      }
    });

    // 4. EFFET : Construction du Portfolio (Trades -> Portfolio)
    // Se déclenche dès que la liste des trades change dans le service
    effect(() => {
      const trades = this.tradeService.activeTrades();
      
      if (trades && trades.length > 0) {
        this.buildPortfolio(trades);
      } else {
        this.portfolio = [];
        this.totalValue = 0;
      }
    });
  }

  ngOnInit() {
    // L'initialisation se fait via les effects() du constructeur
  }

  // --- LOGIQUE MÉTIER PORTFOLIO ---

  async buildPortfolio(trades: any[]) {
    // A. Agrégation : On regroupe les trades par crypto
    const assetMap = new Map<string, CryptoAsset>();

    for (const trade of trades) {
      if (assetMap.has(trade.cryptoId)) {
        // Si l'actif existe déjà, on ajoute la quantité
        const asset = assetMap.get(trade.cryptoId)!;
        asset.amount += trade.remainingAmount;
      } else {
        // Sinon on crée la ligne
        assetMap.set(trade.cryptoId, {
          id: trade.cryptoId,
          name: trade.name,
          symbol: trade.symbol,
          amount: trade.remainingAmount,
          icon: trade.icon,
          currentPrice: trade.buyPrice // On met le prix d'achat temporairement en attendant l'API
        });
      }
    }

    // B. Conversion en tableau
    this.portfolio = Array.from(assetMap.values());
    this.calculateTotal();

    // C. Mise à jour avec les PRIX LIVE (API)
    // On parcourt chaque actif pour aller chercher son vrai prix actuel
    this.portfolio.forEach((asset, index) => {
      this.apiService.getCryptoDetails(asset.id).subscribe({
        next: (data) => {
          // On met à jour le prix dans le tableau
          // Adaptez 'data.market_data.current_price.eur' selon la structure exacte de votre API
          const livePrice = data.market_data?.current_price?.eur || data.currentPrice || asset.currentPrice;
          
          this.portfolio[index].currentPrice = livePrice;
          this.calculateTotal(); // On recalcule le total global à chaque mise à jour de prix
        },
        error: (err) => console.error(`Erreur prix pour ${asset.name}`, err)
      });
    });
  }

  calculateTotal() {
    this.totalValue = this.portfolio.reduce((acc, curr) => acc + (curr.amount * curr.currentPrice), 0);
  }

  // --- ACTIONS ---

  async onUpdateNames() {
    if (this.updateForm.invalid) return;

    try {
      // Mise à jour groupée
      const updates = {
        lastName: this.updateForm.value.newLastName,
        firstName: this.updateForm.value.newFirstName
      };
      await this.userService.updateProfile(updates);
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la mise à jour.');
    }
  }

  async onResetPassword() {
    if (this.resetForm.valid) {
      try {
        const firebaseUser = this.authService.getcurrentUser();
        if (firebaseUser) {
          await updatePassword(firebaseUser, this.resetForm.value.newPassword);
          alert('Mot de passe mis à jour !');
          this.resetForm.reset();
        }
      } catch (e) {
        alert('Erreur : Reconnectez-vous pour changer le mot de passe.');
      }
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }
}