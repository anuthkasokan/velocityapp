/**
 * Application Configuration
 * 
 * This file configures all application-level providers using Angular's standalone API.
 * No NgModule is needed - providers are directly registered here.
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { gamesReducer } from './store/reducer';
import { GamesEffects } from './store/effects';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ games: gamesReducer }),
    provideEffects([GamesEffects]),
    provideStoreDevtools({ maxAge: 25 })
  ]
};
