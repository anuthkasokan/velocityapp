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
  private actions$ = inject(Actions);
  private service = inject(VideoGameService);

  loadGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.loadGames),
      mergeMap(() =>
        this.service.getGames().pipe(
          map((games) => GamesActions.loadGamesSuccess({ games })),
          catchError((error) => of(GamesActions.loadGamesFailure({ error })))
        )
      )
    )
  );

  addGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.addGame),
      mergeMap(({ game }) =>
        this.service.addGame(game).pipe(
          mergeMap(() => this.service.getGames()),
          map((games) => GamesActions.loadGamesSuccess({ games })),
          catchError((error) => of(GamesActions.addGameFailure({ error })))
        )
      )
    )
  );

  updateGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.updateGame),
      mergeMap(({ game }) =>
        this.service.updateGame(game).pipe(
          mergeMap(() => this.service.getGames()),
          map((games) => GamesActions.loadGamesSuccess({ games })),
          catchError((error) => of(GamesActions.updateGameFailure({ error })))
        )
      )
    )
  );

  deleteGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.deleteGame),
      mergeMap(({ id }) =>
        this.service.deleteGame(id).pipe(
          map(() => GamesActions.deleteGameSuccess({ id })),
          catchError((error) => of(GamesActions.deleteGameFailure({ error })))
        )
      )
    )
  );
}
