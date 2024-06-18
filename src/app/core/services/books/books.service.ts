import { Injectable, inject } from '@angular/core';
import {
  AddNewBook,
  AllBooks,
  BookDetails,
  EditBook,
} from '../../../interfaces/books.interfaces';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SERVER } from '../../../constants/contsatnts';
import { Category } from '../../../interfaces/categories.interfaces';
import { Message } from '../../../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private _bookDetails = new BehaviorSubject<BookDetails | null>(null);
  private _allBooks = new BehaviorSubject<AllBooks | null>(null);
  private _isLoading = new BehaviorSubject<boolean>(false);
  private _message = new BehaviorSubject<null | Message>(null);
  private _http = inject(HttpClient);

  public get isLoading() {
    return this._isLoading.asObservable();
  }

  public get message() {
    return this._message.asObservable();
  }

  public get allBooks() {
    return this._allBooks.asObservable();
  }
  public get bookDetails() {
    return this._bookDetails.asObservable();
  }

  public resetError() {
    this._message.next(null);
  }

  public deleteBook(id: string) {
    this._isLoading.next(true);

    this._http.delete<AllBooks>(`${SERVER}/books/${id}`).subscribe({
      next: (book) => {
        this._isLoading.next(false);

        const books = this._allBooks.getValue();
        const amount = books?.amount;

        const filterBooks = {
          books: books?.books.filter((book) => book.id !== id) ?? [],
          amount: amount ? amount - 1 : 0,
        };

        this._allBooks.next(filterBooks);
      },
      error: this.handleError.bind(this),
    });
  }

  public getAllBooks() {
    this._isLoading.next(true);

    this._http.get<AllBooks>(`${SERVER}/books`).subscribe({
      next: (book) => {
        this._isLoading.next(false);
        this._allBooks.next(book);
      },
      error: this.handleError.bind(this),
    });
  }

  public getBookDetails(id: string) {
    this._isLoading.next(true);

    this._http.get<BookDetails>(`${SERVER}/books/${id}`).subscribe({
      next: (book) => {
        this._isLoading.next(false);
        this._bookDetails.next(book);
      },
      error: this.handleError.bind(this),
    });
  }

  public createNewBook(book: AddNewBook) {
    this._isLoading.next(true);

    const formData = new FormData();
    formData.append('title', book.title);
    formData.append('BookDescripton', book.bookDescription);
    formData.append('authorId', book.authorId);
    formData.append('NumberOfPage', book.numberOfPages.toString());
    formData.append('publicationDate', book.publicationDate.toISOString());
    formData.append('availableCopies', book.availableCopies.toString());

    book.categoriesIds.forEach((categoryId) => {
      formData.append('CategoriesIds', categoryId);
    });

    if (book.imageFile) {
      formData.append('imageFile', book.imageFile);
    }

    this._http
      .post<{ id: string }>(`${SERVER}/books/addBook`, formData)
      .subscribe({
        next: this.handleNewBookCreation.bind(this),
        error: this.handleError.bind(this),
      });
  }

  public editBook(book: EditBook) {
    this._isLoading.next(true);

    const formData = new FormData();
    formData.append('id', book.id);
    formData.append('title', book.title);
    formData.append('BookDescripton', book.bookDescription);
    formData.append('deleteFile', book.deleteFile.toString());
    formData.append('NumberOfPage', book.numberOfPages.toString());
    formData.append('publicationDate', book.publicationDate.toISOString());
    formData.append('availableCopies', book.availableCopies.toString());

    book.categoriesIds.forEach((categoryId) => {
      formData.append('CategoriesIds', categoryId);
    });

    if (book.imageFile) {
      formData.append('imageFile', book.imageFile);
    }

    this._http
      .post<{ id: string }>(`${SERVER}/books/updateBook`, formData)
      .subscribe({
        next: () => {
          this._message.next({
            type: 'success',
            message: `Book was edited`,
          });
          this._isLoading.next(false);
          this._message.next(null);
        },
        error: this.handleError.bind(this),
      });
  }

  private handleNewBookCreation() {
    this._message.next({
      type: 'success',
      message: `Added new book`,
    });
    this._isLoading.next(false);
    this._message.next(null);
  }

  private handleError(err: HttpErrorResponse) {
    this._isLoading.next(false);
    if (err.status !== 401)
      this._message.next({ type: 'error', message: err.error });
  }
}
