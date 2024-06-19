import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { SERVER } from '../../../constants/contsatnts';
import { AuthService } from '../auth/auth.service';
import { Message } from '../../../interfaces/message.interface';
import { Loans, ReturnLoan } from '../../../interfaces/loans.interface';

@Injectable({
  providedIn: 'root',
})
export class LoansService {
  private _isLoading = new BehaviorSubject<boolean>(false);
  private _loans = new BehaviorSubject<Loans | null>(null);

  private _message = new BehaviorSubject<null | Message>(null);
  private _http = inject(HttpClient);
  private _authService = inject(AuthService);

  public get isLoading() {
    return this._isLoading.asObservable();
  }

  public get loans() {
    return this._loans.asObservable();
  }

  public get message() {
    return this._message.asObservable();
  }

  public resetError() {
    this._message.next(null);
  }

  public getUserLoans(userId: string) {
    this._isLoading.next(true);

    this._http.get<Loans>(`${SERVER}/loans/getUserLoans/${userId}`).subscribe({
      next: (loans) => {
        this._isLoading.next(false);
        this._loans.next(loans);
      },
      error: this.handleError.bind(this),
    });
  }

  public getAllLoans() {
    this._isLoading.next(true);

    this._http.get<Loans>(`${SERVER}/loans`).subscribe({
      next: (loans) => {
        this._isLoading.next(false);
        this._loans.next(loans);
      },
      error: this.handleError.bind(this),
    });
  }

  public returnLoan(loanId: string) {
    this._isLoading.next(true);

    this._http
      .post<ReturnLoan>(`${SERVER}/loans/returnLoan`, { id: loanId })
      .subscribe({
        next: (res) => {
          const returnDate = new Date(res.returnDate);
          this._isLoading.next(false);

          const loans = this._loans.getValue();
          const amount = loans?.amount;

          const newLoans: Loans = {
            loans: loans
              ? loans.loans.map((res) => {
                  if (res.id === loanId)
                    return { ...res, returnDate: returnDate };
                  else return res;
                })
              : [],
            amount: amount ? amount : 0,
          };

          this._loans.next(newLoans);
        },
        error: this.handleError.bind(this),
      });
  }

  public createLoan(bookId: string) {
    this._authService.user.pipe(take(1)).subscribe((user) => {
      if (user) {
        const loanData = {
          bookId,
          userId: user.id,
        };

        this._isLoading.next(true);
        this._http.post(`${SERVER}/loans/createloan`, loanData).subscribe({
          next: () => {
            this._isLoading.next(false);
            this._message.next({
              type: 'success',
              message: 'Loan was made',
            });

            this._message.next(null);
          },
          error: this.handleError.bind(this),
        });
      }
    });
  }

  private handleError(err: HttpErrorResponse) {
    this._isLoading.next(false);

    if (err.status === 403)
      this._message.next({
        type: 'error',
        message: 'Your role disallow you to make this action',
      });
    else if (err.status !== 401)
      this._message.next({ type: 'error', message: err.error });

    this._message.next(null);
  }
}
