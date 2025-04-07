import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'index.html', pathMatch: 'full' },
  { path: 'index.html', redirectTo: '', pathMatch: 'full' },
];
