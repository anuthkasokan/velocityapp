import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { VideoGame } from '../models/video-game.model';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class VideoGameService {
  private gamesSubject = new BehaviorSubject<VideoGame[]>([]);
  public games$ = this.gamesSubject.asObservable();

  constructor(private http: HttpClient, private configService: AppConfigService) {}

  getGames(): Observable<VideoGame[]> {
    return this.http.get<VideoGame[]>(this.configService.api('games')).pipe(
      tap((games) => this.gamesSubject.next(games)),
      catchError((err) => {
        console.error('Failed to fetch games', err);
        this.gamesSubject.next([]);
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
      switchMap((created) =>
        this.http.get<VideoGame[]>(this.configService.api('games')).pipe(
          tap((list) => this.gamesSubject.next(list)),
          map(() => created)
        )
      ),
      catchError((err) => {
        console.error('Failed to add game', err);
        return of(game);
      })
    );
  }

  updateGame(game: any): Observable<VideoGame | null> {
    return this.http.put<VideoGame>(this.configService.api(`games/${game.id}`), game).pipe(
      switchMap((updated) =>
        this.http.get<VideoGame[]>(this.configService.api('games')).pipe(
          tap((list) => this.gamesSubject.next(list)),
          map(() => updated)
        )
      ),
      catchError((err) => {
        console.error(`Failed to update game ${game.id}`, err);
        return of(null);
      })
    );
  }

  deleteGame(id: number): Observable<boolean> {
    return this.http.delete<void>(this.configService.api(`games/${id}`)).pipe(
      switchMap(() =>
        this.http.get<VideoGame[]>(this.configService.api('games')).pipe(
          tap((list) => this.gamesSubject.next(list)),
          map(() => true)
        )
      ),
      catchError((err) => {
        console.error(`Failed to delete game ${id}`, err);
        return of(false);
      })
    );
  }
}
