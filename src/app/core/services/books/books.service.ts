import { Injectable, inject } from '@angular/core';
import { AddNewBook } from '../../../interfaces/books.interfaces';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SERVER } from '../../../constants/contsatnts';
import { Category } from '../../../interfaces/categories.interfaces';
import { Message } from '../../../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private _isLoading = new BehaviorSubject<boolean>(false);
  private _message = new BehaviorSubject<null | Message>(null);
  private _http = inject(HttpClient);

  public get isLoading() {
    return this._isLoading.asObservable();
  }

  public get message() {
    return this._message.asObservable();
  }

  public resetError() {
    this._message.next(null);
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
