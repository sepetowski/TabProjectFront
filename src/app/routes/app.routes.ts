import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./library.routes').then((mod) => mod.libraryRoutes),
  },
  {
    path: 'auth',
    canActivate: [authGuard],
    loadChildren: () => import('./auth.routes').then((mod) => mod.authRoutes),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./admin.routes').then((mod) => mod.adminRoutes),
  },
  {
    path: '**',
    loadComponent: () =>
      import('../pages/not-found/not-found.component').then(
        (mod) => mod.NotFoundComponent
      ),
  },
];
