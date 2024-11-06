import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appRouterProviders } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
provideHttpClient
bootstrapApplication(AppComponent, {
  providers: [
    appRouterProviders,
    provideHttpClient(),
    importProvidersFrom(RouterModule),
    BrowserAnimationsModule   // Esto asegurará que el routing esté disponible
  ]
}).catch(err => console.error(err));
