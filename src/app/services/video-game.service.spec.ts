import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { VideoGameService } from './video-game.service';
import { AppConfigService } from './app-config.service';
import { VideoGame } from '../models/video-game.model';
import { provideHttpClient } from '@angular/common/http';

describe('VideoGameService', () => {
  let service: VideoGameService;
  let httpMock: HttpTestingController;
  let configService: any;

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
    const configSpy = {
      api: vi.fn((path: string) => `http://localhost:3000/${path}`)
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        VideoGameService,
        { provide: AppConfigService, useValue: configSpy }
      ]
    });

    service = TestBed.inject(VideoGameService);
    httpMock = TestBed.inject(HttpTestingController);
    configService = TestBed.inject(AppConfigService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getGames', () => {
    it('should return games', async () => {
      const promise = service.getGames().toPromise();

      const req = httpMock.expectOne('http://localhost:3000/games');
      expect(req.request.method).toBe('GET');
      req.flush(mockGames);

      const games = await promise;
      expect(games).toEqual(mockGames);
    });

    it('should return empty array on error', async () => {
      const promise = service.getGames().toPromise();

      const req = httpMock.expectOne('http://localhost:3000/games');
      req.error(new ProgressEvent('Network error'));

      const games = await promise;
      expect(games).toEqual([]);
    });
  });

  describe('getGameById', () => {
    it('should return a single game', async () => {
      const promise = service.getGameById(1).toPromise();

      const req = httpMock.expectOne('http://localhost:3000/games/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockGames[0]);

      const game = await promise;
      expect(game).toEqual(mockGames[0]);
    });

    it('should return null on error', async () => {
      const promise = service.getGameById(999).toPromise();

      const req = httpMock.expectOne('http://localhost:3000/games/999');
      req.error(new ProgressEvent('Not found'));

      const game = await promise;
      expect(game).toBeNull();
    });
  });

  describe('addGame', () => {
    it('should create a new game', async () => {
      const newGame = { title: 'New Game', description: 'Description' };
      const promise = service.addGame(newGame).toPromise();

      const req = httpMock.expectOne('http://localhost:3000/games');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newGame);
      req.flush(mockGames[0]);

      const game = await promise;
      expect(game).toEqual(mockGames[0]);
    });

    it('should handle error', async () => {
      const newGame = { title: 'New Game' };
      const promise = service.addGame(newGame).toPromise();

      const req = httpMock.expectOne('http://localhost:3000/games');
      req.error(new ProgressEvent('Error'));

      const game = await promise;
      expect(game).toEqual(newGame as any);
    });
  });

  describe('updateGame', () => {
    it('should update an existing game', async () => {
      const updatedGame = { ...mockGames[0], title: 'Updated' };
      const promise = service.updateGame(updatedGame).toPromise();

      const req = httpMock.expectOne('http://localhost:3000/games/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedGame);
      req.flush(updatedGame);

      const game = await promise;
      expect(game).toEqual(updatedGame);
    });

    it('should return null on error', async () => {
      const promise = service.updateGame(mockGames[0]).toPromise();

      const req = httpMock.expectOne('http://localhost:3000/games/1');
      req.error(new ProgressEvent('Error'));

      const game = await promise;
      expect(game).toBeNull();
    });
  });

  describe('deleteGame', () => {
    it('should delete a game', async () => {
      const promise = service.deleteGame(1).toPromise();

      const req = httpMock.expectOne('http://localhost:3000/games/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      const result = await promise;
      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      const promise = service.deleteGame(1).toPromise();

      const req = httpMock.expectOne('http://localhost:3000/games/1');
      req.error(new ProgressEvent('Error'));

      const result = await promise;
      expect(result).toBe(false);
    });
  });
});
