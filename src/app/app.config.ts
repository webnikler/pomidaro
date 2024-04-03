import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { APP_ROUTES } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '@environment';
import { ApiProvider } from '@data/common/api/api.provider';
import { AuthProvider } from '@data/common/auth/auth.provider';
import { IconsProvider } from '@data/common/icons/icons.provider';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideAnimationsAsync(),
    importProvidersFrom([
      HttpClientModule,
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideFirestore(() => getFirestore()),
      provideAuth(() => getAuth()),
    ]),
    ApiProvider,
    AuthProvider,
    IconsProvider,
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }
  ],
};
