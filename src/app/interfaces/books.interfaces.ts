import { Category } from './categories.interfaces';

export interface BookWithCategories {
  id: string;
  title: string;
  imageUrl?: string;
  isAvaible: boolean;
  categories: Category[];
}

export interface BookWithCategoriesAndAuthor extends BookWithCategories {
  authorId: string;
  authorName: string;
  authorSurname: string;
}

export interface AllBooks {
  books: BookWithCategoriesAndAuthor[];
  amount: number;
}

export interface BookDetails {
  id: string;
  title: string;
  bookDescripton: string;
  availableCopies: number;
  numberOfPage: number;
  imageUrl?: string | null;
  isAvaible: boolean;
  authorId: string;
  authorName: string;
  authorSurname: string;
  authorDateOfBirth?: Date;
  authorDescription?: string;
  categories: Category[];
}

export interface EditBook {
  id: string;
  title: string;
  bookDescription: string;
  availableCopies: number;
  numberOfPages: number;
  categoriesIds: string[];
  publicationDate: Date;
  imageFile: null | File;
  deleteFile: boolean;
}

export interface AddNewBook {
  title: string;
  authorId: string;
  bookDescription: string;
  availableCopies: number;
  numberOfPages: number;
  categoriesIds: string[];
  publicationDate: Date;
  imageFile: null | File;
}
