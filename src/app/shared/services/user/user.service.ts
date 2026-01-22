import { Injectable } from '@angular/core';
import { Firestore, getDoc, doc, docData, updateDoc } from '@angular/fire/firestore';
import { firstValueFrom, map, Observable } from 'rxjs';
import { UserDocument } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  getUser(uid: string): Observable<UserDocument> {
    return docData(doc(this.firestore, 'UserDocument', uid)) as Observable<UserDocument>;
  }

  async getFirstName(uid: string): Promise<string> {
    const userDoc = await firstValueFrom(this.getUser(uid));
    return `${userDoc.firstName}`;
  }

  async getLastName(uid: string): Promise<string> {
    const userDoc = await firstValueFrom(this.getUser(uid));
    return `${userDoc.lastName}`;
  }

  async getBalance(uid: string): Promise<number> {
    const userDoc = await firstValueFrom(this.getUser(uid));
    return userDoc.balance;
  }

  updateFirstName(uid: string, firstName: number) {
    return updateDoc(doc(this.firestore, 'UserDocument', uid), { firstName });
  }

  updateLastName(uid: string, lastName: number) {
    return updateDoc(doc(this.firestore, 'UserDocument', uid), { lastName });
  }

  updateBalance(uid: string, balance: number) {
    return updateDoc(doc(this.firestore, 'UserDocument', uid), { balance });
  }
}

