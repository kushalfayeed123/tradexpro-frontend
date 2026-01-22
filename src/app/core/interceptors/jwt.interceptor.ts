import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { AuthState } from '../../auth/state/auth.state';
import { Logout } from '../../auth/state/auth.actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const router = inject(Router);
  const notify = inject(NotificationService);
  const token = store.selectSnapshot(AuthState.token);

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        store.dispatch(new Logout());
        notify.show('Session expired. Please login again.', 'warning');
        router.navigate(['/login']);
      } else if (error.status === 0) {
        notify.show('Unable to connect to server.', 'error');
      } else if (error.status >= 500) {
        notify.show('Server error. Please try again later.', 'error');
      }

      return throwError(() => error);
    })
  );
};