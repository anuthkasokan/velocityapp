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
  providedIn: 'root'
})
export class VideoGameService {

  constructor(private http: HttpClient, private configService: AppConfigService) {}

  getGames(): Observable<VideoGame[]> {
    return this.http.get<VideoGame[]>(this.configService.api('games')).pipe(
      catchError((err) => {
        console.error('Failed to fetch games', err);
        return of([]);
      })
    );
  }

  getGameById(id: number): Observable<VideoGame | null> {
    return this.http.get<VideoGame>(this.configService.api(`games/${id}`)).pipe(
      catchError((err) => {
        console.error(`Failed to fetch game ${id}`, err);
        return of(null);
      })
    );
  }

  addGame(game: any): Observable<VideoGame> {
    return this.http.post<VideoGame>(this.configService.api('games'), game).pipe(
      catchError((err) => {
        console.error('Failed to add game', err);
        return of(game as VideoGame);
      })
    );
  }

  updateGame(game: any): Observable<VideoGame | null> {
    return this.http.put<VideoGame>(this.configService.api(`games/${game.id}`), game).pipe(
      catchError((err) => {
        console.error(`Failed to update game ${game.id}`, err);
        return of(null);
      })
    );
  }

  deleteGame(id: number): Observable<boolean> {
    return this.http.delete<void>(this.configService.api(`games/${id}`)).pipe(
      map(() => true),
      catchError((err) => {
        console.error(`Failed to delete game ${id}`, err);
        return of(false);
      })
    );
  }
}
