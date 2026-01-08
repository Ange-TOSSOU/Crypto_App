import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common'
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    console.log("log out");

    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
