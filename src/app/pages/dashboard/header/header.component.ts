import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { CryptoApiService } from '../../../shared/services/api/api.service'; // ✅ Import API
import { ProfileComponent } from "../profile/profile.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private apiService = inject(CryptoApiService); // ✅ Injection API

  // États des modales
  isProfileOpen: boolean = false;
  isSearchOpen: boolean = false;
  
  // États de la recherche
  searchQuery: string = '';
  searchResults: any[] = [];
  isLoading: boolean = false;
  private searchTimeout: any; // Variable pour stocker le timer

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // --- GESTION RECHERCHE ---

  openSearch() {
    this.isSearchOpen = true;
  }

  closeSearch() {
    this.isSearchOpen = false;
    this.searchQuery = ''; 
    this.searchResults = []; // On vide les résultats en fermant
  }

  // 🔥 C'est ici que la magie opère
  onSearchChange() {
    // 1. Si la recherche est trop courte, on vide et on arrête
    if (!this.searchQuery || this.searchQuery.length < 2) {
      this.searchResults = [];
      return;
    }

    this.isLoading = true;

    // 2. Annule l'appel précédent si l'utilisateur tape encore (Debounce)
    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    // 3. On attend 500ms avant d'envoyer la requête
    this.searchTimeout = setTimeout(() => {
      
      this.apiService.searchCryptos(this.searchQuery).subscribe({
        next: (data) => {
          // L'API renvoie un objet { coins: [...] }
          this.searchResults = data.coins || [];
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Erreur recherche:", err);
          this.isLoading = false;
        }
      });

    }, 500); // 500ms de délai
  }

  selectCrypto(cryptoId: string) {
    console.log("Crypto choisie:", cryptoId);
    this.closeSearch();
    // 👉 À décommenter quand vous aurez créé la page de détail :
    // this.router.navigate(['/market', cryptoId]); 
  }

  // --- GESTION PROFIL ---

  openProfile() {
    this.isProfileOpen = true;
  }

  closeProfile() {
    this.isProfileOpen = false;
  }
}