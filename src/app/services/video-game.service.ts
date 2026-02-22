/**
 * Video Game Service
 * 
 * Handles all HTTP communication with the backend API for video games.
 * This is the data layer - components/effects call this, never directly use HttpClient.
 * 
 * All methods include error handling to gracefully handle API failures.
 */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { VideoGame } from '../models/video-game.model';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'  // Single instance shared across the app
})
export class VideoGameService {

  constructor(
    private http: HttpClient,  // Angular HTTP client for REST calls
    private configService: AppConfigService  // Provides API base URL
  ) {}

  /**
   * Get All Games
   * GET /api/games
   * Returns empty array on error instead of throwing
   */
  getGames(): Observable<VideoGame[]> {
    return this.http.get<VideoGame[]>(this.configService.api('games')).pipe(
      catchError((err) => {
        console.error('Failed to fetch games', err);
        return of([]);  // Return empty array on error
      })
    );
  }

  /**
   * Get Game By ID
   * GET /api/games/:id
   * Returns null on error (game not found or API failure)
   */
  getGameById(id: number): Observable<VideoGame | null> {
    return this.http.get<VideoGame>(this.configService.api(`games/${id}`)).pipe(
      catchError((err) => {
        console.error(`Failed to fetch game ${id}`, err);
        return of(null);  // Return null if not found
      })
    );
  }

  /**
   * Add New Game
   * POST /api/games
   * Returns the created game with ID assigned by backend
   */
  addGame(game: any): Observable<VideoGame> {
    return this.http.post<VideoGame>(this.configService.api('games'), game).pipe(
      catchError((err) => {
        console.error('Failed to add game', err);
        return of(game as VideoGame);  // Return original object on error
      })
    );
  }

  /**
   * Update Existing Game
   * PUT /api/games/:id
   * Returns the updated game or null on error
   */
  updateGame(game: any): Observable<VideoGame | null> {
    return this.http.put<VideoGame>(this.configService.api(`games/${game.id}`), game).pipe(
      catchError((err) => {
        console.error(`Failed to update game ${game.id}`, err);
        return of(null);
      })
    );
  }

  /**
   * Delete Game
   * DELETE /api/games/:id
   * Returns boolean: true if deleted, false on error
   */
  deleteGame(id: number): Observable<boolean> {
    return this.http.delete<void>(this.configService.api(`games/${id}`)).pipe(
      map(() => true),  // Convert void response to success boolean
      catchError((err) => {
        console.error(`Failed to delete game ${id}`, err);
        return of(false);  // Return false on error
      })
    );
  }
}
