import { BookWithCategories } from './books.interfaces';

export interface NewAuthor {
  name: string;
  surname: string;
  description: string | null;
  dateOfBirth: Date | null;
}

export interface Author {
  id: string;
  name: string;
  surname: string;
  description: string | null;
  dateOfBirth: Date | null;
}

export interface AuthorsList {
  authors: Author[];
  amount: number;
}

export interface AuthorDetails {
  id: string;
  name: string;
  surname: string;
  description: string | null;
  dateOfBirth: Date | null;
  books: BookWithCategories[];
  amount: number;
}
