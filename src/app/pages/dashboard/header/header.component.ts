import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Nécessaire pour l'input de recherche
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  private authService = inject(AuthService);
  private router = inject(Router);

  isSearchOpen: boolean = false;
  searchQuery: string = '';

  logout() {
    console.log("log out");

    this.authService.logout();

    this.router.navigate(['/login']);
  }

  openSearch() {
    this.isSearchOpen = true;
  }

  closeSearch() {
    this.isSearchOpen = false;
    this.searchQuery = ''; 
  }
}