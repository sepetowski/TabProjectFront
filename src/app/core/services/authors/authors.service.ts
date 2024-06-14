import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Author,
  AuthorsList,
  NewAuthor,
} from '../../../interfaces/authors.interfaces';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Message } from '../../../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  private _authors = new BehaviorSubject<AuthorsList | null>(null);
  private _isLoading = new BehaviorSubject<boolean>(false);
  private _message = new BehaviorSubject<null | Message>(null);
  private _http = inject(HttpClient);

  public get authors() {
    return this._authors.asObservable();
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

  public createNewAuthor(author: NewAuthor) {
    this._isLoading.next(true);

    this._http
      .post<Author>('https://localhost:7101/api/authors', author)
      .subscribe({
        next: this.handleNewAuthorCreation.bind(this),
        error: this.handleError.bind(this),
      });
  }

  public getAllAuthors() {
    this._isLoading.next(true);

    this._http
      .get<AuthorsList>('https://localhost:7101/api/authors')
      .subscribe({
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
