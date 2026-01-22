import { Injectable, inject, computed } from '@angular/core';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { switchMap, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserDocument } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // --- 1. ÉTAT UTILISATEUR (AUTOMATIQUE) ---
  private userState = toSignal(
    authState(this.auth).pipe(
      switchMap(firebaseUser => {
        if (!firebaseUser) return of(null);
        return docData(doc(this.firestore, 'UserDocument', firebaseUser.uid), { idField: 'uid' });
      })
    )
  );

  // --- 2. SELECTEURS PUBLICS ---
  // Accédez à tout le profil ici (nom, prénom, solde, etc.)
  currentUser = computed(() => this.userState() as UserDocument | null | undefined);
  
  currentUserId = computed(() => this.currentUser()?.uid);


  // --- 3. ACTIONS ---
  
  // Met à jour le solde
  async updateBalance(newBalance: number) {
    const uid = this.currentUserId();
    if (!uid) throw new Error("Erreur: Utilisateur non connecté");
    
    await updateDoc(doc(this.firestore, 'UserDocument', uid), { balance: newBalance });
  }

  // Met à jour le prénom (Type corrigé: string)
  async updateFirstName(firstName: string) {
    const uid = this.currentUserId();
    if (!uid) throw new Error("Erreur: Utilisateur non connecté");

    await updateDoc(doc(this.firestore, 'UserDocument', uid), { firstName });
  }

  // Met à jour le nom (Type corrigé: string)
  async updateLastName(lastName: string) {
    const uid = this.currentUserId();
    if (!uid) throw new Error("Erreur: Utilisateur non connecté");

    await updateDoc(doc(this.firestore, 'UserDocument', uid), { lastName });
  }

  // Méthode générique pour mettre à jour plusieurs champs d'un coup
  async updateProfile(data: Partial<UserDocument>) {
    const uid = this.currentUserId();
    if (!uid) throw new Error("Erreur: Utilisateur non connecté");

    await updateDoc(doc(this.firestore, 'UserDocument', uid), data);
  }
}