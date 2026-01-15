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
import { from, switchMap, tap, Observable } from 'rxjs';
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
    //return from(promise);
    return from(promise).pipe(
    switchMap((credential: UserCredential) =>
      from(credential.user.getIdToken()).pipe(
        tap((token: string) => {
          localStorage.setItem('token', token);
        }),
        switchMap(() => from([credential]))
      )
    )
  );
  }

  logout(): Observable<void> {
    localStorage.removeItem('token');
    const promise = signOut(this.firebaseAuth).then(() => {
      sessionStorage.clear();
    });
    return from(promise);
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const json = atob(payload);
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.email) return null;

    return decoded.email;
  }

  getcurrentUser(): User | null {
    return this.firebaseAuth.currentUser;
  }
}
