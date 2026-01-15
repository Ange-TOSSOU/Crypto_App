import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { TradeItem, CryptoToTrade } from '../../models/crypto-info';
import { PortfolioRepository } from './portfolio.repo';

@Injectable({
  providedIn: 'root'
})
export class FirebasePortfolioRepository extends PortfolioRepository {

  constructor(private firestore: Firestore) {
    super();
  }

  private get tradesCollection() {
    return collection(this.firestore, 'trades');
  }

  getTradesByUser(userId: string): Observable<TradeItem[]> {
    const q = query(
      this.tradesCollection,
      where('userid', '==', userId)
    );

    return collectionData(q, { idField: 'id' }) as Observable<TradeItem[]>;
  }

  async addTrade(trade: TradeItem): Promise<void> {
    await addDoc(this.tradesCollection, {
      ...trade,
      date: trade.date
    });
  }
  async selectCryptoToTrade(data: CryptoToTrade): Promise<void> {
    const ref = collection(this.firestore, 'selectedCrypto');
    await addDoc(ref, data);
  }
}
