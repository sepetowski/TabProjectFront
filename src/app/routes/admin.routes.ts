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
  {
    path: 'new-book',
    loadComponent: () =>
      import('../pages/admin/new-book/new-book.component').then(
        (mod) => mod.NewBookComponent
      ),
  },
  {
    path: 'new-category',
    loadComponent: () =>
      import('../pages/admin/new-category/new-category.component').then(
        (mod) => mod.NewCategoryComponent
      ),
  },
];
