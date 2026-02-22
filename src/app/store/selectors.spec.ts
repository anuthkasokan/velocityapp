import { describe, it, expect } from 'vitest';
import { selectAllGames, selectGamesLoading, selectGamesError } from './selectors';
import { GamesState } from './reducer';
import { VideoGame } from '../models/video-game.model';

describe('Games Selectors', () => {
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

  const mockState: GamesState = {
    games: mockGames,
    loading: false,
    error: null
  };

  describe('selectAllGames', () => {
    it('should return all games', () => {
      const result = selectAllGames.projector(mockState);
      expect(result).toEqual(mockGames);
    });

    it('should return empty array when games is null', () => {
      const result = selectAllGames.projector(null as any);
      expect(result).toEqual([]);
    });
  });

  describe('selectGamesLoading', () => {
    it('should return loading state', () => {
      const result = selectGamesLoading.projector(mockState);
      expect(result).toBe(false);
    });

    it('should return false when state is null', () => {
      const result = selectGamesLoading.projector(null as any);
      expect(result).toBe(false);
    });
  });

  describe('selectGamesError', () => {
    it('should return error state', () => {
      const result = selectGamesError.projector(mockState);
      expect(result).toBeNull();
    });

    it('should return error message when present', () => {
      const stateWithError = { ...mockState, error: 'Test error' };
      const result = selectGamesError.projector(stateWithError);
      expect(result).toBe('Test error');
    });

    it('should return null when state is null', () => {
      const result = selectGamesError.projector(null as any);
      expect(result).toBeNull();
    });
  });
});
