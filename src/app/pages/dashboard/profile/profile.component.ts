import { Component, inject, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { updatePassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { UserService } from '../../../shared/services/user/user.service';

interface CryptoAsset {
  name: string;
  symbol: string;
  amount: number;
  currentPrice: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  // SERVICES (Publics pour être accessibles dans le HTML)
  public authService = inject(AuthService);
  public userService = inject(UserService);

  private router = inject(Router);
  private fb = inject(FormBuilder);

  // FORMULAIRES & DONNÉES LOCALES
  resetForm: FormGroup;
  updateForm: FormGroup;

  portfolio: CryptoAsset[] = [];
  totalValue = 0;

  constructor() {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // 2. Initialisation Update Profile
    this.updateForm = this.fb.group({
      newLastName: ['', [Validators.required, Validators.minLength(2)]],
      newFirstName: ['', [Validators.required, Validators.minLength(2)]]
    });

    // Dès que le signal currentUser change (chargement initial ou mise à jour),
    // on remplit le formulaire.
    effect(() => {
      const user = this.userService.currentUser();
      if (user) {
        this.updateForm.patchValue({
          newLastName: user.lastName,
          newFirstName: user.firstName
        }, { emitEvent: false }); // emitEvent: false évite de déclencher des boucles
      }
    });
  }

  async ngOnInit() {
    const uid = this.userService.currentUserId();
    if (uid) {
      await this.loadPortfolio(uid);
    }
  }


  async loadPortfolio(uid: string) {
    // Mock data (À remplacer par un appel API réel plus tard)
    this.portfolio = [
      { name: 'Bitcoin', symbol: 'BTC', amount: 0.24, currentPrice: 42000 },
      { name: 'Ethereum', symbol: 'ETH', amount: 3.5, currentPrice: 2250 },
      { name: 'Solana', symbol: 'SOL', amount: 45, currentPrice: 98 }
    ];
    this.calculateTotal();
  }

  async calculateTotal() {
    this.totalValue = this.portfolio.reduce((acc, curr) => acc + (curr.amount * curr.currentPrice), 0);
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
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
        alert('Erreur. Vous devez peut-être vous reconnecter pour changer le mot de passe.');
      }
    }
  }

  async onUpdateNames() {
    if (this.updateForm.valid) {
      try {
        await this.userService.updateLastName(this.updateForm.value.newLastName);
        await this.userService.updateFirstName(this.updateForm.value.newFirstName);


        alert('Profil mis à jour avec succès !');

      } catch (e) {
        console.error(e);
        alert('Erreur lors de la mise à jour des informations.');
      }
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}