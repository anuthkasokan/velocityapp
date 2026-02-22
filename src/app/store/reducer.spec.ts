import { describe, it, expect } from 'vitest';
import { gamesReducer, initialState, GamesState } from './reducer';
import * as GamesActions from './actions';
import { VideoGame } from '../models/video-game.model';

describe('Games Reducer', () => {
  const mockGame: VideoGame = {
    id: 1,
    title: 'Test Game',
    description: 'Test Description',
    releaseDate: '2026-01-01',
    genre: { id: 1, name: 'Action' },
    publisher: { id: 1, name: 'Test Publisher' },
    developer: { id: 1, name: 'Test Developer' }
  };

  const mockGames: VideoGame[] = [
    mockGame,
    {
      id: 2,
      title: 'Test Game 2',
      description: 'Test Description 2',
      releaseDate: '2026-02-01',
      genre: { id: 2, name: 'RPG' },
      publisher: { id: 2, name: 'Publisher 2' },
      developer: { id: 2, name: 'Developer 2' }
    }
  ];

  describe('initial state', () => {
    it('should return the initial state', () => {
      const result = gamesReducer(undefined, { type: 'Unknown' });
      expect(result).toEqual(initialState);
    });
  });

  describe('loadGames', () => {
    it('should set loading to true', () => {
      const action = GamesActions.loadGames();
      const result = gamesReducer(initialState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('loadGamesSuccess', () => {
    it('should set games and loading to false', () => {
      const action = GamesActions.loadGamesSuccess({ games: mockGames });
      const result = gamesReducer(initialState, action);
      expect(result.games).toEqual(mockGames);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('loadGamesFailure', () => {
    it('should set error and loading to false', () => {
      const error = 'Failed to load games';
      const action = GamesActions.loadGamesFailure({ error });
      const result = gamesReducer(initialState, action);
      expect(result.error).toEqual(error);
      expect(result.loading).toBe(false);
      expect(result.games).toEqual([]);
    });
  });

  describe('addGameSuccess', () => {
    it('should add game to the state', () => {
      const action = GamesActions.addGameSuccess({ game: mockGame });
      const result = gamesReducer(initialState, action);
      expect(result.games).toContain(mockGame);
      expect(result.games.length).toBe(1);
    });
  });

  describe('updateGameSuccess', () => {
    it('should update the game in the state', () => {
      const stateWithGame: GamesState = {
        ...initialState,
        games: [mockGame]
      };
      const updatedGame = { ...mockGame, title: 'Updated Title' };
      const action = GamesActions.updateGameSuccess({ game: updatedGame });
      const result = gamesReducer(stateWithGame, action);
      expect(result.games[0].title).toBe('Updated Title');
      expect(result.games.length).toBe(1);
    });

    it('should not change other games', () => {
      const stateWithGames: GamesState = {
        ...initialState,
        games: mockGames
      };
      const updatedGame = { ...mockGame, title: 'Updated Title' };
      const action = GamesActions.updateGameSuccess({ game: updatedGame });
      const result = gamesReducer(stateWithGames, action);
      expect(result.games[0].title).toBe('Updated Title');
      expect(result.games[1].title).toBe('Test Game 2');
    });
  });

  describe('deleteGameSuccess', () => {
    it('should remove the game from state', () => {
      const stateWithGames: GamesState = {
        ...initialState,
        games: mockGames
      };
      const action = GamesActions.deleteGameSuccess({ id: 1 });
      const result = gamesReducer(stateWithGames, action);
      expect(result.games.length).toBe(1);
      expect(result.games.find(g => g.id === 1)).toBeUndefined();
    });

    it('should not affect other games', () => {
      const stateWithGames: GamesState = {
        ...initialState,
        games: mockGames
      };
      const action = GamesActions.deleteGameSuccess({ id: 1 });
      const result = gamesReducer(stateWithGames, action);
      expect(result.games.find(g => g.id === 2)).toBeDefined();
    });
  });
});
