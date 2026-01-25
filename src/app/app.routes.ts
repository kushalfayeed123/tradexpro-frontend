import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { authGuard, adminGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Auth, canActivate: [loginGuard] },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'investor',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./investor/investor-routes').then(m => m.INVESTOR_ROUTES),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
