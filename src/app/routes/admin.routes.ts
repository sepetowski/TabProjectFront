import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'reservation-history',
  },
  {
    path: 'new-author',
    loadComponent: () =>
      import('../pages/admin/new-author/new-author.component').then(
        (mod) => mod.NewAuthorComponent
      ),
  },
  {
    path: 'edit-author/:id',
    loadComponent: () =>
      import('../pages/admin/edit-author/edit-author.component').then(
        (mod) => mod.EditAuthorComponent
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
    path: 'edit-book/:id',
    loadComponent: () =>
      import('../pages/admin/edit-book/edit-book.component').then(
        (mod) => mod.EditBookComponent
      ),
  },
  {
    path: 'new-category',
    loadComponent: () =>
      import('../pages/admin/new-category/new-category.component').then(
        (mod) => mod.NewCategoryComponent
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('../pages/admin/category-list/category-list.component').then(
        (mod) => mod.CategoryListComponent
      ),
  },
  {
    path: 'edit-category/:id',
    loadComponent: () =>
      import('../pages/admin/edit-category/edit-category.component').then(
        (mod) => mod.EditCategoryComponent
      ),
  },
  {
    path: 'reservation-history',
    loadComponent: () =>
      import(
        '../pages/admin/reservations-hisotry/reservations-hisotry.component'
      ).then((mod) => mod.ReservationsHisotryComponent),
  },
  {
    path: 'loans-history',
    loadComponent: () =>
      import('../pages/admin/loans-hisotry/loans-hisotry.component').then(
        (mod) => mod.LoansHisotryComponent
      ),
  },
];
