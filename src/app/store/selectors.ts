import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GamesState } from './reducer';

export const selectGamesState = createFeatureSelector<GamesState>('games');

export const selectAllGames = createSelector(selectGamesState, (state) => state?.games ?? []);
export const selectGamesLoading = createSelector(selectGamesState, (state) => state?.loading ?? false);
export const selectGamesError = createSelector(selectGamesState, (state) => state?.error ?? null);
