import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environnement';

@Injectable({
  providedIn: 'root'
})
export class CryptoApiService {

  private baseUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false';

  constructor(private http: HttpClient) {}

  getCryptos(): Observable<any[]> {

    const params = {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 20,
      page: 1,
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
        change7d: item.price_change_percentage_7d_in_currency,
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
