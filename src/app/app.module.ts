import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppComponent } from './app.component';
//import { firebaseConfig } from './app.config';

@NgModule({
  imports: [
    BrowserModule,
    //AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AppComponent
  ],
  //bootstrap: [AppComponent]
})
export class AppModule {}
