import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';
import { GamesEffects } from './effects';
import { VideoGameService } from '../services/video-game.service';
import * as GamesActions from './actions';
import { VideoGame } from '../models/video-game.model';
import { Action } from '@ngrx/store';

describe('GamesEffects', () => {
  let actions$: Observable<Action>;
  let effects: GamesEffects;
  let videoGameService: any;

  const mockGames: VideoGame[] = [
    {
      id: 1,
      title: 'Test Game',
      description: 'Test Description',
      releaseDate: '2026-01-01',
      genre: { id: 1, name: 'Action' },
      publisher: { id: 1, name: 'Test Publisher' },
      developer: { id: 1, name: 'Test Developer' }
    }
  ];

  beforeEach(() => {
    const serviceSpy = {
      getGames: vi.fn(),
      addGame: vi.fn(),
      updateGame: vi.fn(),
      deleteGame: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        GamesEffects,
        provideMockActions(() => actions$),
        { provide: VideoGameService, useValue: serviceSpy }
      ]
    });

    effects = TestBed.inject(GamesEffects);
    videoGameService = TestBed.inject(VideoGameService);
  });

  describe('loadGames$', () => {
    it('should return loadGamesSuccess on success', async () => {
      videoGameService.getGames.mockReturnValue(of(mockGames));
      actions$ = of(GamesActions.loadGames());

      const action = await firstValueFrom(effects.loadGames$);
      expect(action).toEqual(GamesActions.loadGamesSuccess({ games: mockGames }));
    });

    it('should return loadGamesFailure on error', async () => {
      const error = 'Test error';
      videoGameService.getGames.mockReturnValue(throwError(() => error));
      actions$ = of(GamesActions.loadGames());

      const action = await firstValueFrom(effects.loadGames$);
      expect(action).toEqual(GamesActions.loadGamesFailure({ error }));
    });
  });

  describe('addGame$', () => {
    it('should return loadGamesSuccess after adding game', async () => {
      const newGame = { title: 'New Game', description: 'Description' };
      videoGameService.addGame.mockReturnValue(of(mockGames[0]));
      videoGameService.getGames.mockReturnValue(of(mockGames));
      actions$ = of(GamesActions.addGame({ game: newGame }));

      const action = await firstValueFrom(effects.addGame$);
      expect(action).toEqual(GamesActions.loadGamesSuccess({ games: mockGames }));
    });

    it('should return addGameFailure on error', async () => {
      const error = 'Add failed';
      videoGameService.addGame.mockReturnValue(throwError(() => error));
      actions$ = of(GamesActions.addGame({ game: {} }));

      const action = await firstValueFrom(effects.addGame$);
      expect(action).toEqual(GamesActions.addGameFailure({ error }));
    });
  });

  describe('updateGame$', () => {
    it('should return loadGamesSuccess after updating game', async () => {
      videoGameService.updateGame.mockReturnValue(of(mockGames[0]));
      videoGameService.getGames.mockReturnValue(of(mockGames));
      actions$ = of(GamesActions.updateGame({ game: mockGames[0] }));

      const action = await firstValueFrom(effects.updateGame$);
      expect(action).toEqual(GamesActions.loadGamesSuccess({ games: mockGames }));
    });

    it('should return updateGameFailure on error', async () => {
      const error = 'Update failed';
      videoGameService.updateGame.mockReturnValue(throwError(() => error));
      actions$ = of(GamesActions.updateGame({ game: mockGames[0] }));

      const action = await firstValueFrom(effects.updateGame$);
      expect(action).toEqual(GamesActions.updateGameFailure({ error }));
    });
  });

  describe('deleteGame$', () => {
    it('should return deleteGameSuccess on success', async () => {
      videoGameService.deleteGame.mockReturnValue(of(true));
      actions$ = of(GamesActions.deleteGame({ id: 1 }));

      const action = await firstValueFrom(effects.deleteGame$);
      expect(action).toEqual(GamesActions.deleteGameSuccess({ id: 1 }));
    });

    it('should return deleteGameFailure on error', async () => {
      const error = 'Delete failed';
      videoGameService.deleteGame.mockReturnValue(throwError(() => error));
      actions$ = of(GamesActions.deleteGame({ id: 1 }));

      const action = await firstValueFrom(effects.deleteGame$);
      expect(action).toEqual(GamesActions.deleteGameFailure({ error }));
    });
  });
});
