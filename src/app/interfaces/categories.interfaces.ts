export interface NewCategory {
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Categories {
  categories: Category[];
  amount: number;
}
