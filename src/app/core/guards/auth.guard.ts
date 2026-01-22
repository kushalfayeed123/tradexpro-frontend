import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../auth/state/auth.state';
import { User } from '../../common/models/user.model';


export const authGuard: CanActivateFn = (route, state) => {
    const store = inject(Store);
    const router = inject(Router);

    const isAuthenticated = store.selectSnapshot(AuthState.isAuthenticated);

    if (isAuthenticated) {
        return true;
    }

    // If not authenticated, redirect to login but save the attempted URL
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const adminGuard = () => {

    const store = inject(Store);
    const router = inject(Router);
    let user: User | null = store.selectSnapshot(AuthState.user);

    if (user && user.role === 'admin') {
        return true;
    }
    return router.parseUrl('/login');
};

// guest.guard.ts
export const loginGuard: CanActivateFn = () => {
    const store = inject(Store);
    const router = inject(Router);
    const user = store.selectSnapshot(AuthState.user);

    if (store.selectSnapshot(AuthState.isAuthenticated)) {
        const target = user?.role === 'admin' ? '/admin/dashboard' : '/investor/dashboard';
        return router.createUrlTree([target]);
    }
    return true;
};