import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then((m) => m) },
  { path: 'es', loadComponent: () => import('./features/home/home').then((m) => m) },
  { path: 'en', loadComponent: () => import('./features/home/home').then((m) => m) },
];
