import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'new-author',
  },
  {
    path: 'new-author',
    loadComponent: () =>
      import('../pages/admin/new-author/new-author.component').then(
        (mod) => mod.NewAuthorComponent
      ),
  },
];
