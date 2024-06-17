import { Injectable, inject } from '@angular/core';
import {
  Categories,
  Category,
  NewCategory,
} from '../../../interfaces/categories.interfaces';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../../../interfaces/message.interface';
import { SERVER } from '../../../constants/contsatnts';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private _categories = new BehaviorSubject<Categories | null>(null);
  private _isLoading = new BehaviorSubject<boolean>(false);
  private _message = new BehaviorSubject<null | Message>(null);
  private _http = inject(HttpClient);

  public get categories() {
    return this._categories.asObservable();
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

  public getAllCategories() {
    this._isLoading.next(true);

    this._http.get<Categories>(`${SERVER}/categories`).subscribe({
      next: (categories) => {
        this._isLoading.next(false);
        this._categories.next(categories);
      },
      error: this.handleError.bind(this),
    });
  }

  public createNewCategory(category: NewCategory) {
    this._isLoading.next(true);

    this._http.post<Category>(`${SERVER}/categories`, category).subscribe({
      next: this.handleNewCategoryCreation.bind(this),
      error: this.handleError.bind(this),
    });
  }

  private handleNewCategoryCreation() {
    this._message.next({
      type: 'success',
      message: `Added new category`,
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
