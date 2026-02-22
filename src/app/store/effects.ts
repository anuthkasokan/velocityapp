/**
 * NgRx Effects
 * 
 * Side effect handlers for async operations (API calls).
 * Effects listen for actions, perform async work, then dispatch new actions.
 * 
 * Flow: Action dispatched -> Effect listens -> API call -> Dispatch success/failure action
 * 
 * Key RxJS Operators:
 * - ofType: Filter actions by type
 * - mergeMap: Handle multiple concurrent requests (doesn't cancel previous)
 * - map: Transform data and create new action
 * - catchError: Handle errors and return failure action
 */
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as GamesActions from './actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { VideoGameService } from '../services/video-game.service';

@Injectable()
export class GamesEffects {
  // Modern DI: inject() function instead of constructor injection
  private actions$ = inject(Actions);  // Stream of all dispatched actions
  private service = inject(VideoGameService);  // API service

  /**
   * Load Games Effect
   * Triggered by: loadGames action
   * API Call: GET /api/games
   * Success: Dispatch loadGamesSuccess with games array
   * Failure: Dispatch loadGamesFailure with error
   */
  loadGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.loadGames),  // Only react to loadGames action
      mergeMap(() =>  // Switch to API observable
        this.service.getGames().pipe(
          map((games) => GamesActions.loadGamesSuccess({ games })),  // On success
          catchError((error) => of(GamesActions.loadGamesFailure({ error })))  // On error
        )
      )
    )
  );

  /**
   * Add Game Effect
   * Triggered by: addGame action
   * API Call: POST /api/games, then GET /api/games (refresh list)
   * Success: Dispatch loadGamesSuccess with updated games array
   * Failure: Dispatch addGameFailure with error
   */
  addGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.addGame),
      mergeMap(({ game }) =>
        this.service.addGame(game).pipe(
          mergeMap(() => this.service.getGames()),  // Refresh entire list after add
          map((games) => GamesActions.loadGamesSuccess({ games })),
          catchError((error) => of(GamesActions.addGameFailure({ error })))
        )
      )
    )
  );

  /**
   * Update Game Effect
   * Triggered by: updateGame action
   * API Call: PUT /api/games/:id, then GET /api/games (refresh list)
   * Success: Dispatch loadGamesSuccess with updated games array
   * Failure: Dispatch updateGameFailure with error
   */
  updateGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.updateGame),
      mergeMap(({ game }) =>
        this.service.updateGame(game).pipe(
          mergeMap(() => this.service.getGames()),  // Refresh entire list after update
          map((games) => GamesActions.loadGamesSuccess({ games })),
          catchError((error) => of(GamesActions.updateGameFailure({ error })))
        )
      )
    )
  );

  /**
   * Delete Game Effect
   * Triggered by: deleteGame action
   * API Call: DELETE /api/games/:id
   * Success: Dispatch deleteGameSuccess with ID (reducer removes from array)
   * Failure: Dispatch deleteGameFailure with error
   */
  deleteGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.deleteGame),
      mergeMap(({ id }) =>
        this.service.deleteGame(id).pipe(
          map(() => GamesActions.deleteGameSuccess({ id })),  // Only return ID
          catchError((error) => of(GamesActions.deleteGameFailure({ error })))
        )
      )
    )
  );
}
