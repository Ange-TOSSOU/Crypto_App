import { Injectable } from '@angular/core';
import {
  Auth,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification ,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
  User,
  UserCredential
} from '@angular/fire/auth';
import { setPersistence } from 'firebase/auth';
import { from, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;
  constructor(private firebaseAuth: Auth) {
    this.setSessionStoragePersistence();
    this.user$ = user(this.firebaseAuth);
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
  }

  signUp(email: string, password: string) {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(async (cred) => {
      if (cred.user) {
        await sendEmailVerification(cred.user);
      }

      return cred;
    });
    return from(promise);
  }

  login(email: string, password: string): Observable<UserCredential> {
    const promise: Promise<UserCredential> = signInWithEmailAndPassword(this.firebaseAuth, email, password);
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {
      sessionStorage.clear();
    });
    return from(promise);
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
