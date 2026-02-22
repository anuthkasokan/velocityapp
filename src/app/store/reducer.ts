/**
 * NgRx Reducer
 * 
 * Pure function that takes current state and an action, returns new state.
 * NEVER mutate state directly - always return a new object.
 * Uses createReducer for type safety and cleaner syntax.
 */
import { createReducer, on } from '@ngrx/store';
import * as GamesActions from './actions';
import { VideoGame } from '../models/video-game.model';

/**
 * State Interface
 * Defines the shape of the games slice in the store
 */
export interface GamesState {
  games: VideoGame[];     // Array of all games
  loading: boolean;       // Loading indicator for API calls
  error: any;            // Error object from failed operations
}

/**
 * Initial State
 * Starting point when app loads - empty games array
 */
export const initialState: GamesState = {
  games: [],
  loading: false,
  error: null,
};

/**
 * Games Reducer
 * Handles all game-related state transitions
 */
export const gamesReducer = createReducer(
  initialState,
  
  // Load Games - Set loading flag and clear errors
  on(GamesActions.loadGames, (state) => ({ 
    ...state, 
    loading: true, 
    error: null 
  })),
  
  // Load Success - Store games and clear loading
  on(GamesActions.loadGamesSuccess, (state, { games }) => ({ 
    ...state, 
    games,           // Replace entire games array
    loading: false 
  })),
  
  // Load Failure - Store error and clear loading
  on(GamesActions.loadGamesFailure, (state, { error }) => ({ 
    ...state, 
    error, 
    loading: false 
  })),

  // Add Game Success - Append new game to array
  on(GamesActions.addGameSuccess, (state, { game }) => ({ 
    ...state, 
    games: [...state.games, game]  // Immutable array append
  })),
  
  // Update Game Success - Replace updated game in array
  on(GamesActions.updateGameSuccess, (state, { game }) => ({
    ...state,
    games: state.games.map((g) => (g.id === game.id ? game : g)),  // Immutable update
  })),
  
  // Delete Game Success - Remove game from array
  on(GamesActions.deleteGameSuccess, (state, { id }) => ({
    ...state,
    games: state.games.filter((g) => g.id !== id),  // Immutable filter
  }))
);
