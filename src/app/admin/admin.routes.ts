import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'users', loadComponent: () => import('./pages/users/users').then(m => m.Users) },
      { path: 'kyc', loadComponent: () => import('./pages/kyc/kyc').then(m => m.Kyc) },
      { path: 'investments', loadComponent: () => import('./pages/investments/investments').then(m => m.Investments) },
      { path: 'plans', loadComponent: () => import('./pages/investment-plans/investment-plans').then(m => m.InvestmentPlans) },
      { path: 'promotions', loadComponent: () => import('./pages/promotion/promotion').then(m => m.Promotion) },
      { path: 'transactions', loadComponent: () => import('./pages/transactions/transactions').then(m => m.Transactions) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings').then(m => m.Settings) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
