import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config'; // Importez votre config !

bootstrapApplication(AppComponent, appConfig) // Passez appConfig ici
  .catch((err) => console.error(err));