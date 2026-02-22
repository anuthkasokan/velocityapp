import { Routes } from '@angular/router';
import { EditComponent } from './components/edit/edit.component';
import { BrowseComponent } from './components/browse/browse.component';

export const routes: Routes = [
  { path: '', component: BrowseComponent },
  { path: 'edit/:id', component: EditComponent },
  { path: '**', redirectTo: '' }
];
