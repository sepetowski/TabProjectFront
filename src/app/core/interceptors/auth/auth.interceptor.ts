import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpParams,
} from '@angular/common/http';
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
        params: new HttpParams().set('Authorization', `Bearer ${user.token}`),
      });

      return next(newReq);
    }),
    catchError((err: HttpErrorResponse) => {
      console.log(err);

      if (err.status === 401) {
        console.log('Unauthorized');
        router.navigate(['/']);
      }

      return throwError(() => err);
    })
  );
};
