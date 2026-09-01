import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'index.html', pathMatch: 'full' },
  { path: 'index.html', redirectTo: '', pathMatch: 'full' },
  { path: '', loadChildren: () => import('./pages/products/products.routes').then(r => r.PRODUCTS_ROUTES) },
  {
    path: 'advpl-integration',
    loadComponent: () =>
      import('./pages/advpl-integration/advpl-integration.component').then(c => c.AdvplIntegrationComponent)
  },
  {
    path: 'protheus-services',
    title: 'Serviços',
    loadChildren: () =>
      import('./pages/protheus-services/protheus-services.routes').then(r => r.PROTHEUS_SERVICES_ROUTES)
  },
  {
    path: 'protheus-functions',
    title: 'Funções',
    loadChildren: () =>
      import('./pages/protheus-functions/protheus-functions.routes').then(r => r.PROTHEUS_FUNCTIONS_ROUTES)
  }
];
