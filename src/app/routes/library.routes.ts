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
    path: 'my-loans',
    loadComponent: () =>
      import('../pages/library/my-loans/my-loans.component').then(
        (mod) => mod.MyLoansComponent
      ),
  },
  {
    path: 'my-reservations',
    loadComponent: () =>
      import('../pages/library/my-reservations/my-reservations.component').then(
        (mod) => mod.MyReservationsComponent
      ),
  },
  {
    path: 'book/:id',
    loadComponent: () =>
      import('../pages/library/books/book-details/book-details.component').then(
        (mod) => mod.BookDetailsComponent
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
