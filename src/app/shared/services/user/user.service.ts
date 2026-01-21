import { Injectable } from '@angular/core';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserDocument } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  getUser(uid: string): Observable<UserDocument> {
    return docData(doc(this.firestore, 'UserDocument', uid)) as Observable<UserDocument>;
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

