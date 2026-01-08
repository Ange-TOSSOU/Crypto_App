import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoApiService {

  private baseUrl = 'https://api.coingecko.com/api/v3/coins/markets';

  constructor(private http: HttpClient) { }

  getCryptos(page: number = 1, limit: number = 20): Observable<any[]> {

    const params: any = {
      vs_currency: 'eur',
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

  getPriceHistory(
    coinId: string,
    days: number | string): Observable<{ date: Date; price: number }[]> {

    const params = {
      vs_currency: 'eur',
      days: days.toString()
    };

    return this.http.get<any>(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      { params }
    ).pipe(
      map(response =>
        response.prices.map((p: [number, number]) => ({
          date: new Date(p[0]),
          price: p[1]
        }))
      ),
      catchError(error => {
        console.error('Erreur historique prix :', error);
        return throwError(() => error);
      })
    );
  }

  //pour pouvoir afficher l'historique avec des bougies
  getCryptoOHLC(coinId: string, days: string): Observable<any[]> {
    // days peut être '1', '7', '14', '30', '90', '180', '365'
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`;

    return this.http.get<any[]>(url).pipe(
      catchError(error => {
        console.error('Erreur OHLC :', error);
        return throwError(() => error);
      })
    );
  }
  getCryptoDetails(coinId: string): Observable<any> {
  return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/${coinId}`).pipe(
    map(response => ({
      id: response.id,
      name: response.name,
      symbol: response.symbol.toUpperCase(),
      logo: response.image?.large || '',
      currentPrice: response.market_data?.current_price?.usd || 0
     
    })),
    catchError(err => {
      console.error('can not get details :', err);
      return throwError(() => err);
    })
  );
}


}