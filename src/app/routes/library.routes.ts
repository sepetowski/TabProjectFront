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
  {
    path: 'authors',
    loadComponent: () =>
      import('../pages/library/authors/authors.component').then(
        (mod) => mod.AuthorsComponent
      ),
  },
  {
    path: 'authors/author/:id',
    loadComponent: () =>
      import(
        '../pages/library/authors/author-details/author-details.component'
      ).then((mod) => mod.AuthorDetailsComponent),
  },
];
