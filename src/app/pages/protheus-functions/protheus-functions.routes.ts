import { Routes } from '@angular/router';

export const PROTHEUS_FUNCTIONS_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        title: 'Funções',
        pathMatch: 'full',
        loadComponent: () => import('./protheus-functions.component').then(c => c.ProtheusFunctionsComponent),
      },
      {
        path: 'user-companies',
        title: 'Empresas do usuário',
        loadComponent: () => import('./user-companies/user-companies.component').then(c => c.UserCompaniesComponent),
      },
      {
        path: 'user-branches',
        title: 'Filiais do usuário',
        loadComponent: () => import('./user-branches/user-branches.component').then(c => c.UserBranchesComponent),
      },
      {
        path: 'user-access',
        title: 'Validador de acessos do usuário',
        loadComponent: () => import('./user-access/user-access.component').then(c => c.UserAccessComponent),
      },
    ],
  },
];
