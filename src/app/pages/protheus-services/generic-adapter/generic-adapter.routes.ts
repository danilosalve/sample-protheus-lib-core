import { Routes } from '@angular/router';

export const GENERIC_ADAPTER_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        title: 'Lista',
        loadComponent: () => import('./list/list.component').then(c => c.ListComponent),
      },
      {
        path: 'query',
        title: 'Consulta',
        loadComponent: () => import('./query/query.component').then(c => c.QueryComponent),
      },
    ],
  },
];
