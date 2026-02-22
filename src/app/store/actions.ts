/**
 * NgRx Actions
 * 
 * Actions are dispatched throughout the app to trigger state changes.
 * Using createAction provides type safety and reduces boilerplate.
 * 
 * Action Flow:
 * Component -> dispatch(action) -> Reducer (sync state change)
 *                               -> Effect (async side effect) -> dispatch(success/failure action)
 */
import { createAction, props } from '@ngrx/store';
import { VideoGame } from '../models/video-game.model';

export const loadGames = createAction('[Games] Load Games');
export const loadGamesSuccess = createAction('[Games] Load Games Success', props<{ games: VideoGame[] }>());
export const loadGamesFailure = createAction('[Games] Load Games Failure', props<{ error: any }>());

export const addGame = createAction('[Games] Add Game', props<{ game: Partial<VideoGame> }>());
export const addGameSuccess = createAction('[Games] Add Game Success', props<{ game: VideoGame }>());
export const addGameFailure = createAction('[Games] Add Game Failure', props<{ error: any }>());

export const updateGame = createAction('[Games] Update Game', props<{ game: VideoGame }>());
export const updateGameSuccess = createAction('[Games] Update Game Success', props<{ game: VideoGame }>());
export const updateGameFailure = createAction('[Games] Update Game Failure', props<{ error: any }>());

export const deleteGame = createAction('[Games] Delete Game', props<{ id: number }>());
export const deleteGameSuccess = createAction('[Games] Delete Game Success', props<{ id: number }>());
export const deleteGameFailure = createAction('[Games] Delete Game Failure', props<{ error: any }>());
