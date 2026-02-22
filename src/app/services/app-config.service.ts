/**
 * App Configuration Service
 * 
 * Centralized configuration management for the application.
 * Loads settings from app.config.json file.
 * 
 * This pattern allows:
 * - Easy environment switching (dev, staging, prod)
 * - Single source of truth for API endpoints
 * - No hardcoded URLs throughout the codebase
 */
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
