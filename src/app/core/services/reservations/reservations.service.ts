import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { Message } from '../../../interfaces/message.interface';
import { AuthService } from '../auth/auth.service';
import { SERVER } from '../../../constants/contsatnts';
import { Reservations } from '../../../interfaces/reserations.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  private _isLoading = new BehaviorSubject<boolean>(false);
  private _reservations = new BehaviorSubject<Reservations | null>(null);

  private _message = new BehaviorSubject<null | Message>(null);
  private _http = inject(HttpClient);
  private _authService = inject(AuthService);

  public get isLoading() {
    return this._isLoading.asObservable();
  }

  public get reservations() {
    return this._reservations.asObservable();
  }

  public get message() {
    return this._message.asObservable();
  }

  public resetError() {
    this._message.next(null);
  }

  public getUserReservations(userId: string) {
    this._isLoading.next(true);

    this._http
      .get<Reservations>(`${SERVER}/reservations/getUserReservations/${userId}`)
      .subscribe({
        next: (reservations) => {
          this._isLoading.next(false);
          this._reservations.next(reservations);
        },
        error: this.handleError.bind(this),
      });
  }

  public getAllReservations() {
    this._isLoading.next(true);

    this._http.get<Reservations>(`${SERVER}/reservations`).subscribe({
      next: (reservations) => {
        this._isLoading.next(false);
        this._reservations.next(reservations);
      },
      error: this.handleError.bind(this),
    });
  }

  public cancelReservation(reservationId: string) {
    this._isLoading.next(true);

    this._http
      .post(`${SERVER}/reservations/cancelReservation`, { id: reservationId })
      .subscribe({
        next: () => {
          this._isLoading.next(false);

          const reserations = this._reservations.getValue();
          const amount = reserations?.amount;

          const newReservations = {
            reservations: reserations
              ? reserations.reservations.map((res) => {
                  if (res.id === reservationId)
                    return { ...res, isActive: false };
                  else return res;
                })
              : [],
            amount: amount ? amount : 0,
          };

          this._reservations.next(newReservations);
        },
        error: this.handleError.bind(this),
      });
  }

  public createReservation(bookId: string) {
    this._authService.user.pipe(take(1)).subscribe((user) => {
      if (user) {
        const reservationData = {
          bookId,
          userId: user.id,
        };

        this._isLoading.next(true);
        this._http
          .post(`${SERVER}/reservations/createReservation`, reservationData)
          .subscribe({
            next: () => {
              this._isLoading.next(false);
              this._message.next({
                type: 'success',
                message: 'Reservation created successfully',
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
