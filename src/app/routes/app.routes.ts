import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth/auth.guard';
import { RootLayoutComponent as LibraryRootLayoutComponent } from '../layouts/library/root-layout/root-layout.component';
import { RootLayoutComponent as AdminRootLayoutComponent } from '../layouts/admin/root-layout/root-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LibraryRootLayoutComponent,
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
    component: AdminRootLayoutComponent,
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
