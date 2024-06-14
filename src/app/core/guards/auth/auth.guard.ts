import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { UserRole } from '../../../interfaces/auth.interfaces';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user.pipe(
    take(1),
    map((user) => {
      const isAuth = !!user;
      const isAdmin = user?.role == UserRole.admin;
      const path = route.routeConfig?.path;

      const requiresAuth = !path?.startsWith('auth');
      const requiresAdmin = path?.startsWith('admin');

      if (requiresAuth && !isAuth) {
        return router.createUrlTree(['/auth/sign-in']);
      }

      if (requiresAdmin && !isAdmin) {
        return router.createUrlTree(['/']);
      }

      if (!requiresAuth && isAuth) {
        return router.createUrlTree(['/']);
      }

      return true;
    })
  );
};
