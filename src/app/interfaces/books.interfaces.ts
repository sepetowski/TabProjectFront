import { Category } from './categories.interfaces';

export interface BookWithCategories {
  id: string;
  title: string;
  ImageUrl?: string;
  isAvaible: boolean;
  categories: Category[];
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
