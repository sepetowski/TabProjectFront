import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { take, exhaustMap, catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user.pipe(
    take(1),
    exhaustMap((user) => {
      if (!user) return next(req);

      const newReq = req.clone({
        setHeaders: {
          Authorization: `bearer ${user.token}`,
        },
      });

      return next(newReq);
    }),
    catchError((err: HttpErrorResponse) => {
      console.log(err);

      if (err.status === 401) {
        authService.logOut();
      }

      return throwError(() => err);
    })
  );
};
