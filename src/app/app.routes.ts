import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'index.html', pathMatch: 'full' },
  { path: 'index.html', redirectTo: '', pathMatch: 'full' },
  { path: '', loadChildren: () => import('./pages/products/products.routes').then(r => r.PRODUCTS_ROUTES) },
  {
    path: 'examples',
    title: 'Outros exemplos',
    loadComponent: () => import('./pages/examples/examples.component').then(c => c.ExamplesComponent),
  },
];
