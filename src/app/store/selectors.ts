/**
 * NgRx Selectors
 * 
 * Selectors are pure functions for querying slices of state.
 * They are memoized - only recompute when input state changes.
 * 
 * Benefits:
 * - Performance: Caching prevents unnecessary recomputations
 * - Reusability: Use same selector in multiple components
 * - Encapsulation: Components don't need to know state shape
 */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GamesState } from './reducer';

/**
 * Feature Selector
 * Selects the 'games' slice from the root state
 * Root state shape: { games: GamesState }
 */
export const selectGamesState = createFeatureSelector<GamesState>('games');

/**
 * Select All Games
 * Returns the games array from state, or empty array if undefined
 */
export const selectAllGames = createSelector(
  selectGamesState, 
  (state) => state?.games ?? []
);

/**
 * Select Loading State
 * Returns whether an API call is in progress
 */
export const selectGamesLoading = createSelector(
  selectGamesState, 
  (state) => state?.loading ?? false
);

/**
 * Select Error State
 * Returns the last error encountered, or null if none
 */
export const selectGamesError = createSelector(
  selectGamesState, 
  (state) => state?.error ?? null
);
