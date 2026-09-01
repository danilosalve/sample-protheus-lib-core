import { Routes } from '@angular/router';

export const PROTHEUS_SERVICES_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        title: 'Serviços',
        redirectTo: 'user-profile',
        pathMatch: 'full',
      },
      {
        path: 'user-profile',
        loadComponent: () => import('./user-profile/user-profile.component').then(c => c.UserProfileComponent),
      },
      {
        path: 'generic-adapter',
        loadChildren: () => import('./generic-adapter/generic-adapter.routes').then(r => r.GENERIC_ADAPTER_ROUTES),
      },
      {
        path: 'session-info',
        loadComponent: () => import('./session-info/session-info.component').then(c => c.SessionInfoComponent),
      },
      {
        path: 'pro-date',
        loadComponent: () => import('./pro-date/pro-date.component').then(c => c.ProDateComponent),
      },
    ],
  },
];
