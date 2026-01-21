import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  signinForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.signinForm = this.fb.group({
      lastName: ['', [Validators.required, Validators.minLength(1)]],
      firstName: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  submit() {
    if (this.signinForm.invalid) {
      this.signinForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { firstName, lastName, email, password } = this.signinForm.value;
    this.authService.signIn(firstName, lastName, email, password).subscribe({
      next: (cred) => {
        this.loading = false;

        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        console.log(err.message);
        this.errorMessage = "Impossible de créer votre compte.";
      }
    });
  }

  get firstName() {
    return this.signinForm.controls['firstName'];
  }

  get lastName() {
    return this.signinForm.controls['lastName'];
  }

  get mail() {
    return this.signinForm.controls['email'];
  }

  get pwd() {
    return this.signinForm.controls['password'];
  }

}
