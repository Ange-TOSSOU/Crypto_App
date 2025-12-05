import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => 
    initializeApp({ projectId: "crypto-c0b3a", appId: "1:870983626041:web:649fc48e6b81641ef40ce8", storageBucket: "crypto-c0b3a.firebasestorage.app", apiKey: "AIzaSyA2L6IyqFSmlADZrjTm-YczTmLs3wVCy0c", authDomain: "crypto-c0b3a.firebaseapp.com", messagingSenderId: "870983626041"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
