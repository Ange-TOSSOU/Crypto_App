import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (cred) => {
        this.loading = false;

        if (!cred.user.emailVerified) {
          this.errorMessage = "Votre email n'est pas vérifié. Consultez votre boîte mail.";
          return;
        }

        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        console.log(err.message);
        this.errorMessage = "Email ou mot de passe incorrect.";
      }
    });
  }

  get mail() {
    return this.loginForm.controls['email'];
  }

  get pwd() {
    return this.loginForm.controls['password'];
  }

}
