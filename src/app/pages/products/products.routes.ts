import { Routes } from '@angular/router';

/**
 * Rotas da página de Produtos
 */
export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    title: 'Lista de Produtos',
    loadComponent: () => import('./products.component').then(c => c.ProductsComponent),
  },
  {
    path: 'new',
    title: 'Novo Produto',
    loadComponent: () => import('./products-form/products-form.component').then(c => c.ProductsFormComponent),
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./products-form/products-form.component').then(c => c.ProductsFormComponent),
  },
];
