import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoApiService {

  // CORRECTION : On garde juste l'URL de base, sans les paramètres '?'
  private baseUrl = 'https://api.coingecko.com/api/v3/coins/markets';

  constructor(private http: HttpClient) {}

  // J'ajoute des arguments pour rendre la méthode flexible (page, limit)
  getCryptos(page: number = 1, limit: number = 20): Observable<any[]> {

    const params: any = {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: limit,  // Utilise l'argument
      page: page,       // Utilise l'argument
      sparkline: false,
      price_change_percentage: '1h,24h,7d'
    };

    return this.http.get<any[]>(this.baseUrl, { params }).pipe(
      map(data => data.map(item => ({
        id: item.id,
        name: item.name,
        symbol: item.symbol.toUpperCase(),
        logo: item.image,
        price: item.current_price,
        change24h: item.price_change_percentage_24h,
        change7d: item.price_change_percentage_7d_in_currency || 0,
        marketCap: item.market_cap,
        volume: item.total_volume,
      }))),
      catchError(error => {
        console.error('Erreur API :', error);
        return throwError(() => error);
      })
    );
  }
}