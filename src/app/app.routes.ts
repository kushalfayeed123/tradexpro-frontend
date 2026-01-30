import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { authGuard, adminGuard, loginGuard } from './core/guards/auth.guard';
import { Home } from './site/pages/home/home';

export const routes: Routes = [
  { path: 'home', component: Home, },
  { path: 'login', component: Auth,  },
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
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
