import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CryptoApiService } from '../../shared/services/api/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  cryptos: any[] = [];
  loading = false;
  error = false;

  constructor(private api: CryptoApiService) {}

  ngOnInit() {
    this.loadCryptos();
  }

  loadCryptos() {
    this.loading = true;

    this.api.getCryptos().subscribe({
      next: (data) => {
        this.cryptos = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
