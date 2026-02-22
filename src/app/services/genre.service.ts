import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';

export interface Genre {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private genresSubject = new BehaviorSubject<Genre[]>([]);
  public genres$ = this.genresSubject.asObservable();

  constructor(private http: HttpClient, private config: AppConfigService) {}

  getAll(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.config.api('genres')).pipe(
      tap((list) => this.genresSubject.next(list)),
      catchError((err) => {
        console.error('Failed to fetch genres', err);
        this.genresSubject.next([]);
        return of([]);
      })
    );
  }
}
