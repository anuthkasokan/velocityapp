/**
 * Root Application Component
 * 
 * This is the main entry component that bootstraps the application.
 * Uses standalone component architecture (no NgModule needed).
 * The RouterOutlet renders child routes defined in app.routes.ts
 */
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet], // Standalone: directly import dependencies
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Angular signal for reactive title (modern state management)
  protected readonly title = signal('videogamecatalogapp');
}
