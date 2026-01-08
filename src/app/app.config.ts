import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    { provide: LOCALE_ID, useValue: 'fr-FR' }, provideFirebaseApp(() => initializeApp({ projectId: "crypto-c0b3a", appId: "1:870983626041:web:649fc48e6b81641ef40ce8", storageBucket: "crypto-c0b3a.firebasestorage.app", apiKey: "AIzaSyA2L6IyqFSmlADZrjTm-YczTmLs3wVCy0c", authDomain: "crypto-c0b3a.firebaseapp.com", messagingSenderId: "870983626041"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ],
};
