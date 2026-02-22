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
  providedIn: 'root'  // Singleton service
})
export class AppConfigService {
  private config = appConfig;  // Load configuration from JSON

  /**
   * Get API Base URL
   * Example: http://localhost:3000/api
   */
  get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  /**
   * Build Full API Endpoint
   * @param path - API path segment (e.g., 'games', 'genres')
   * @returns Full URL (e.g., 'http://localhost:3000/api/games')
   */
  api(path: string): string {
    return `${this.apiBaseUrl}/${path}`;
  }
}
