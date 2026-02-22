import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';

export interface Developer {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeveloperService {
  private developersSubject = new BehaviorSubject<Developer[]>([]);
  public developers$ = this.developersSubject.asObservable();

  constructor(private http: HttpClient, private config: AppConfigService) {}

  getAll(): Observable<Developer[]> {
    return this.http.get<Developer[]>(this.config.api('developers')).pipe(
      tap((list) => this.developersSubject.next(list)),
      catchError((err) => {
        console.error('Failed to fetch developers', err);
        this.developersSubject.next([]);
        return of([]);
      })
    );
  }
}
