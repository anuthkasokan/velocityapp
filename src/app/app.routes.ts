/**
 * Application Routes
 * 
 * Defines the routing configuration for the application.
 * Uses Angular's standalone routing (no RouterModule needed).
 */
import { Routes } from '@angular/router';
import { EditComponent } from './components/edit/edit.component';
import { BrowseComponent } from './components/browse/browse.component';

export const routes: Routes = [
  // Home route: Browse/list all games
  { path: '', component: BrowseComponent },
  
  // Edit route: Create new game (/edit/new) or update existing (/edit/123)
  { path: 'edit/:id', component: EditComponent },
  
  // Wildcard: Redirect any unknown routes to home
  { path: '**', redirectTo: '' }
];
