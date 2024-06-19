export interface Loan {
  id: string;
  userId: string;
  username: string;
  bookId: string;
  bookTitle: string;
  bookAuthorName: string;
  bookAuthorSurname: string;
  loanDate: Date;
  returnDate?: Date | null;
  imageUrl?: string;
}

export interface Loans {
  loans: Loan[];
  amount: number;
}

export interface ReturnLoan {
  id: string;
  returnDate: Date;
}
