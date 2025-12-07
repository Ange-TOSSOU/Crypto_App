import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  email = '';
  password = '';

  errorMessage = '';
  successMessage = '';

  loading = false;

  constructor(private authService: AuthService) {}

  onSubmit(form: any) {
    if (form.invalid) return;

    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    this.authService.signUp(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Compte créé ! Un email de vérification a été envoyé.';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message;
      }
    });
  }
}
