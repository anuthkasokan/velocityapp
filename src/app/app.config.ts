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
    // Global error handling for uncaught exceptions
    provideBrowserGlobalErrorListeners(),
    
    // Router configuration with defined routes
    provideRouter(routes),
    
    // HttpClient for REST API calls
    provideHttpClient(),
    
    // NgRx Store: Registers 'games' slice with its reducer
    // State shape: { games: GamesState }
    provideStore({ games: gamesReducer }),
    
    // NgRx Effects: Registers side effects for async operations
    provideEffects([GamesEffects]),
    
    // Redux DevTools: Browser extension support for debugging state
    // maxAge: keeps last 25 state changes in history
    provideStoreDevtools({ maxAge: 25 })
  ]
};
