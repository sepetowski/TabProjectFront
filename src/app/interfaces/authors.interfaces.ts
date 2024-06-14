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
