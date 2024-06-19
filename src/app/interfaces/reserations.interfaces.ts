export interface Reservation {
  id: string;
  userId: string;
  username: string;
  bookId: string;
  bookTitle: string;
  bookAuthorName: string;
  bookAuthorSurname: string;
  reservationDate: Date;
  isActive: boolean;
  imageUrl?: string;
}

export interface Reservations {
  reservations: Reservation[];
  amount: number;
}
