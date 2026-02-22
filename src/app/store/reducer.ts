import { createReducer, on } from '@ngrx/store';
import * as GamesActions from './actions';
import { VideoGame } from '../models/video-game.model';

export interface GamesState {
  games: VideoGame[];
  loading: boolean;
  error: any;
}

export const initialState: GamesState = {
  games: [],
  loading: false,
  error: null,
};

export const gamesReducer = createReducer(
  initialState,
  on(GamesActions.loadGames, (state) => ({ ...state, loading: true, error: null })),
  on(GamesActions.loadGamesSuccess, (state, { games }) => ({ ...state, games, loading: false })),
  on(GamesActions.loadGamesFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(GamesActions.addGameSuccess, (state, { game }) => ({ ...state, games: [...state.games, game] })),
  on(GamesActions.updateGameSuccess, (state, { game }) => ({
    ...state,
    games: state.games.map((g) => (g.id === game.id ? game : g)),
  })),
  on(GamesActions.deleteGameSuccess, (state, { id }) => ({
    ...state,
    games: state.games.filter((g) => g.id !== id),
  }))
);
