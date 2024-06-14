import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  UserRegisterData,
  UserRegisterResponseData,
  UserLoginData,
  UserLoginResponseData,
  RefreshTokenReq,
  RefreshTokenRes,
  UserRole,
} from '../../../interfaces/auth.interfaces';
import { User } from '../../../models/user.model';
import { Message } from '../../../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = new BehaviorSubject<User | null>(null);
  private _isLoading = new BehaviorSubject<boolean>(false);
  private _message = new BehaviorSubject<null | Message>(null);

  private _tokenExpirationTimer: NodeJS.Timeout | null = null;

  private _router = inject(Router);

  private _http = inject(HttpClient);

  public get isLoading() {
    return this._isLoading.asObservable();
  }
  public get message() {
    return this._message.asObservable();
  }
  public get user() {
    return this._user.asObservable();
  }

  public signUp(userData: UserRegisterData) {
    this._isLoading.next(true);

    this._http
      .post<UserRegisterResponseData>(
        'https://localhost:7101/api/auth/register',
        userData
      )
      .subscribe({
        next: this.handleRegistration.bind(this),
        error: this.handleError.bind(this),
      });
  }

  public signIn(userData: UserLoginData) {
    this._isLoading.next(true);
    this._http
      .post<UserLoginResponseData>(
        'https://localhost:7101/api/auth/login',
        userData
      )
      .subscribe({
        next: this.handleAuth.bind(this),
        error: this.handleError.bind(this),
      });
  }

  public tryToSignInOnStart() {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const user: User = JSON.parse(userData);

    //TODO check if user has valid type

    const expirationDuration =
      new Date(user.tokenExpirationDate!).getTime() - new Date().getTime();

    const refreshTokenExpired =
      new Date(user.refreshTokenExpirationDate).getTime() -
        new Date().getTime() >
      0
        ? false
        : true;

    if (expirationDuration > 0) {
      this._user.next(user);
      this.startTokenExpirationCountdown(expirationDuration);

      if (user.role === UserRole.admin) this._router.navigate(['/admin']);
    } else {
      if (refreshTokenExpired) {
        this.logOut();
        return;
      }
      this._user.next(user);
      this.refreshToken();

      if (user.role === UserRole.admin) this._router.navigate(['/admin']);
    }
  }

  public logOut() {
    this._user.next(null);

    localStorage.removeItem('user');
    this.clearTokenExpirationTimer();

    this._router.navigate(['/auth/sign-in']);
  }

  public resetError() {
    this._message.next(null);
  }

  private handleRegistration(userResponse: UserRegisterResponseData) {
    this._message.next({
      type: 'success',
      message: `You have been register ${userResponse.username}!`,
    });
    this._isLoading.next(false);
    this._message.next(null);

    this._router.navigate(['/auth/sign-in']);
  }

  private handleAuth(authData: UserLoginResponseData) {
    this._message.next({ type: 'success', message: 'You have been sign in!' });
    this._isLoading.next(false);
    this._message.next(null);

    const user = new User(
      authData.id,
      authData.username,
      authData.firstName,
      authData.lastName,
      authData.email,
      authData.jsonWebToken,
      new Date(authData.jsonWebTokenExpires),
      authData.refreshToken,
      new Date(authData.refreshTokenExpires),
      authData.role
    );

    const expirationDuration =
      user.tokenExpirationDate!.getTime() - new Date().getTime();

    if (expirationDuration > 0) {
      this._user.next(user);
      this.startTokenExpirationCountdown(expirationDuration);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === UserRole.admin) this._router.navigate(['/admin']);
      else this._router.navigate(['/']);
    }
  }

  private handleError(err: HttpErrorResponse) {
    this._isLoading.next(false);
    this._message.next({ type: 'error', message: err.error });
  }

  private startTokenExpirationCountdown(expirationDuration: number) {
    this.clearTokenExpirationTimer();

    this._tokenExpirationTimer = setTimeout(() => {
      this.refreshToken();
    }, expirationDuration);
  }

  private clearTokenExpirationTimer() {
    if (this._tokenExpirationTimer) {
      clearTimeout(this._tokenExpirationTimer);
      this._tokenExpirationTimer = null;
    }
  }

  private refreshToken() {
    const user = this._user.getValue();
    if (!user) return;

    const refreshTokenReq: RefreshTokenReq = {
      refreshToken: user.refreshToken,
      token: user.token!,
    };

    this._http
      .post<RefreshTokenRes>(
        'https://localhost:7101/api/auth/refreshToken',
        refreshTokenReq
      )
      .subscribe({
        next: this.handleRefreshTokenRes.bind(this),
        error: this.logOut.bind(this),
      });
  }

  private handleRefreshTokenRes(refreshTokenRes: RefreshTokenRes) {
    const user = this._user.getValue();

    if (user) {
      const newUser = new User(
        user.id,
        user.username,
        user.firstName,
        user.lastName,
        user.email,
        refreshTokenRes.token,
        new Date(refreshTokenRes.tokenExpires),
        refreshTokenRes.refreshToken,
        new Date(refreshTokenRes.refreshTokenExpires),
        user.role
      );

      const expirationDuration =
        newUser.tokenExpirationDate!.getTime() - new Date().getTime();

      if (expirationDuration > 0) {
        this._user.next(newUser);

        this.startTokenExpirationCountdown(expirationDuration);

        localStorage.setItem('user', JSON.stringify(newUser));
      }
    }
  }
}
