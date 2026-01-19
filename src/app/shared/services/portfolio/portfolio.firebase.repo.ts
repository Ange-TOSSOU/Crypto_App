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
import { CryptoToTrade } from '../../models/crypto-info';
import { PortfolioRepository } from './portfolio.repo';
import { Trade } from '../../models/trade';

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

  getTradesByUser(userId: string): Observable<Trade[]> {
    const q = query(
      this.tradesCollection,
      where('userid', '==', userId)
    );

    return collectionData(q, { idField: 'id' }) as Observable<Trade[]>;
  }

  async addTrade(trade: Trade): Promise<void> {
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
