import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sign-in',
  },
  {
    path: 'sign-in',
    loadComponent: () =>
      import('../pages/auth/sign-in/sign-in.component').then(
        (mod) => mod.SignInComponent
      ),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('../pages/auth/sign-up/sign-up.component').then(
        (mod) => mod.SignUpComponent
      ),
  },
  {
    path: 'new-admin',
    loadComponent: () =>
      import('../pages/auth/new-admin/new-admin.component').then(
        (mod) => mod.NewAdminComponent
      ),
  },
];
