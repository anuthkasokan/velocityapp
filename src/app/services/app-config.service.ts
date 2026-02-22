import { Injectable } from '@angular/core';
import appConfig from '../../configuration/app.config.json';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config = appConfig;

  get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  api(path: string): string {
    return `${this.apiBaseUrl}/${path}`;
  }
}
