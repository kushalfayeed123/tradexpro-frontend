import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'users', loadComponent: () => import('./pages/users/users').then(m => m.Users) },
    //   { path: 'users/:id', loadComponent: () => import('./pages/user-details/user-details.component').then(m => m.UserDetailsComponent) },
      { path: 'kyc', loadComponent: () => import('./pages/kyc/kyc').then(m => m.Kyc) },
    //   { path: 'investments', loadComponent: () => import('./pages/investments/investments.component').then(m => m.InvestmentsComponent) },
    //   { path: 'plans', loadComponent: () => import('./pages/plans/plans.component').then(m => m.PlansComponent) },
    //   { path: 'transactions', loadComponent: () => import('./pages/transactions/transactions.component').then(m => m.TransactionsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
