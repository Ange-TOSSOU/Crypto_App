import { computed, effect, Injectable, inject, signal, OnDestroy } from '@angular/core';
import { 
  Firestore, doc, collection, collectionData, runTransaction, Timestamp 
} from '@angular/fire/firestore';
import { Subscription, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Trade } from '../../models/trade';
import { UserDocument } from '../../models/user';
import { UserService } from '../user/user.service'; // ✅ On importe le UserService

@Injectable({
  providedIn: 'root'
})
export class TradeService implements OnDestroy {
  private firestore = inject(Firestore);
  private userService = inject(UserService); // ✅ Injection

  // --- ÉTAT ---
  private _trades = signal<Trade[]>([]);
  private tradesSubscription?: Subscription;

  // Sélecteurs
  trades = this._trades.asReadonly();
  
  activeTrades = computed(() => this._trades().filter(t => t.status === "open"));
  
  historyTrades = computed(() => 
    this._trades()
      .filter(t => t.status === 'closed')
      .sort((a, b) => {
         const dateA = a.date instanceof Timestamp ? a.date.toMillis() : new Date(a.date).getTime();
         const dateB = b.date instanceof Timestamp ? b.date.toMillis() : new Date(b.date).getTime();
         return dateB - dateA;
      })
  );

  constructor() {
    // 🔥 MAGIE : Dès que l'utilisateur change (login/logout), on change les trades écoutés
    effect(() => {
      const uid = this.userService.currentUserId();
      this.initRealTimeUpdates(uid);
    });
  }

  // Charge les trades en temps réel pour un UID donné
  private initRealTimeUpdates(uid: string | undefined) {
    if (this.tradesSubscription) this.tradesSubscription.unsubscribe();
    
    if (!uid) {
      this._trades.set([]); // Si pas de user, on vide la liste
      return;
    }

    const tradesRef = collection(this.firestore, 'UserDocument', uid, 'trades');
    
    this.tradesSubscription = collectionData(tradesRef, { idField: 'id' })
      .pipe(map(data => data as Trade[]))
      .subscribe(trades => this._trades.set(trades));
  }

  // --- ACTIONS (SANS UID EN PARAMÈTRE) ---

  /**
   * Ouvre une position (ACHAT)
   */
  async openPosition(tradeInfo: Omit<Trade, 'id' | 'status' | 'remainingAmount' | 'realisedPnl' | 'date'>) {
    const uid = this.userService.currentUserId();
    if (!uid) throw new Error("Utilisateur non connecté");

    const userRef = doc(this.firestore, 'UserDocument', uid);
    const tradesCollection = collection(this.firestore, 'UserDocument', uid, 'trades');
    const newTradeRef = doc(tradesCollection);

    const totalCost = tradeInfo.buyPrice * tradeInfo.initialAmount;

    await runTransaction(this.firestore, async (transaction) => {
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) throw new Error("User not found");
      const userData = userSnap.data() as UserDocument;

      transaction.update(userRef, { balance: userData.balance - totalCost });

      const newTrade: Trade = {
        ...tradeInfo,
        id: newTradeRef.id,
        status: 'open',
        remainingAmount: tradeInfo.initialAmount,
        realisedPnl: 0,
        date: Timestamp.now() as any
      };
      transaction.set(newTradeRef, newTrade);
    });
  }

  /**
   * Vend une position (VENTE)
   */
  async sellPosition(tradeId: string, sellAmount: number, sellPrice: number) {
    const uid = this.userService.currentUserId(); // ✅ On récupère l'ID ici !
    if (!uid) throw new Error("Utilisateur non connecté");

    const userRef = doc(this.firestore, 'UserDocument', uid);
    const tradeRef = doc(this.firestore, 'UserDocument', uid, 'trades', tradeId);

    await runTransaction(this.firestore, async (transaction) => {
      const userSnap = await transaction.get(userRef);
      const tradeSnap = await transaction.get(tradeRef);

      if (!tradeSnap.exists()) throw new Error("Trade introuvable");
      
      const userData = userSnap.data() as UserDocument;
      const tradeData = tradeSnap.data() as Trade;

      if (sellAmount > tradeData.remainingAmount) throw new Error("Vente > Solde restant");

      // Calculs
      const revenue = sellAmount * sellPrice; // Ce qu'on récupère en cash
      const profitOnSale = (sellPrice - tradeData.buyPrice) * sellAmount; // Le gain net

      const newRemaining = tradeData.remainingAmount - sellAmount;
      const isClosed = newRemaining < 0.00000001;

      // 1. Update Trade
      transaction.update(tradeRef, {
        remainingAmount: isClosed ? 0 : newRemaining,
        status: isClosed ? 'closed' : 'open',
        realisedPnl: (tradeData.realisedPnl || 0) + profitOnSale
      });

      // 2. Update Solde User (On crédite le revenu total)
      transaction.update(userRef, {
        balance: userData.balance + revenue
      });
    });
  }

  ngOnDestroy() {
    this.tradesSubscription?.unsubscribe();
  }
}