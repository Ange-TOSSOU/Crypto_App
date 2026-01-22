import { Component, OnInit } from '@angular/core';
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

  resetForm: FormGroup;
  userData = { displayName: 'User', email: '' };
  portfolio: CryptoAsset[] = [];
  totalValue = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  async ngOnInit() {
    if (this.authService.isAuthenticated()) {
      const uid = this.authService.getUid() || '';

      this.userData = {
        displayName: `${await this.userService.getFirstName(uid)} ${await this.userService.getLastName(uid)}`,
        email: this.authService.getUserEmail() || 'null'
      };

      await this.loadPortfolio('currentUser.uid');
    }
  }

  async loadPortfolio(uid: string) {
    // Example: Fetching from Firestore collection 'users/[uid]/assets'
    // For this demo, we use mock data
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
        await updatePassword(this.authService.getcurrentUser()!, this.resetForm.value.newPassword);
        alert('Password updated!');
        this.resetForm.reset();
      } catch (e) {
        alert('Error. You may need to login again to change password.');
      }
    }
  }

  onLogout() {
    this.authService.logout();
    
    this.router.navigate(['/login']);
  }
}
