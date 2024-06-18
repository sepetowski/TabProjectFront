import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Author,
  AuthorDetails,
  AuthorsList,
  NewAuthor,
} from '../../../interfaces/authors.interfaces';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Message } from '../../../interfaces/message.interface';
import { SERVER } from '../../../constants/contsatnts';

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  private _authors = new BehaviorSubject<AuthorsList | null>(null);
  private _authorDetrails = new BehaviorSubject<AuthorDetails | null>(null);
  private _isLoading = new BehaviorSubject<boolean>(false);
  private _message = new BehaviorSubject<null | Message>(null);
  private _http = inject(HttpClient);

  public get authors() {
    return this._authors.asObservable();
  }

  public get authorDetails() {
    return this._authorDetrails.asObservable();
  }

  public get isLoading() {
    return this._isLoading.asObservable();
  }

  public get message() {
    return this._message.asObservable();
  }

  public resetError() {
    this._message.next(null);
  }

  public getAuthorsDetails(authorId: string) {
    this._isLoading.next(true);

    this._http.get<AuthorDetails>(`${SERVER}/authors/${authorId}`).subscribe({
      next: (author) => {
        this._isLoading.next(false);
        this._authorDetrails.next(author);
      },
      error: this.handleError.bind(this),
    });
  }

  public deleteAuthor(id: string) {
    this._isLoading.next(true);

    this._http.delete(`${SERVER}/authors/${id}`).subscribe({
      next: (book) => {
        this._isLoading.next(false);

        const authors = this._authors.getValue();
        const amount = authors?.amount;

        const filterAuthors = {
          authors: authors?.authors.filter((author) => author.id !== id) ?? [],
          amount: amount ? amount - 1 : 0,
        };

        this._authors.next(filterAuthors);
      },
      error: this.handleError.bind(this),
    });
  }

  public createNewAuthor(author: NewAuthor) {
    this._isLoading.next(true);

    this._http.post<Author>(`${SERVER}/authors`, author).subscribe({
      next: this.handleNewAuthorCreation.bind(this),
      error: this.handleError.bind(this),
    });
  }

  public updateAuthor(id: string, author: NewAuthor) {
    this._http.put<Author>(`${SERVER}/authors/${id}`, author).subscribe({
      next: () => {
        this._message.next({
          type: 'success',
          message: `Author was edited`,
        });
        this._isLoading.next(false);
        this._message.next(null);
      },
      error: this.handleError.bind(this),
    });
  }

  public getAllAuthors() {
    this._isLoading.next(true);

    this._http.get<AuthorsList>(`${SERVER}/authors`).subscribe({
      next: (authors) => {
        this._isLoading.next(false);
        this._authors.next(authors);
      },
      error: this.handleError.bind(this),
    });
  }

  private handleNewAuthorCreation(author: Author) {
    this._message.next({
      type: 'success',
      message: `Added new Author: ${author.name} ${author.surname}!`,
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
