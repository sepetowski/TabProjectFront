import { Routes } from '@angular/router';

export const libraryRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('../pages/library/books/books.component').then(
        (mod) => mod.BooksComponent
      ),
  },
];
