import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';

export interface Publisher {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private publishersSubject = new BehaviorSubject<Publisher[]>([]);
  public publishers$ = this.publishersSubject.asObservable();

  constructor(private http: HttpClient, private config: AppConfigService) {}

  getAll(): Observable<Publisher[]> {
    return this.http.get<Publisher[]>(this.config.api('publishers')).pipe(
      tap((list) => this.publishersSubject.next(list)),
      catchError((err) => {
        console.error('Failed to fetch publishers', err);
        this.publishersSubject.next([]);
        return of([]);
      })
    );
  }
}
