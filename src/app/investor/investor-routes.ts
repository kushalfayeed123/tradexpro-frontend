import { Routes } from '@angular/router';
import { InvestorLayout } from './layout/investor-layout/investor-layout';


export const INVESTOR_ROUTES: Routes = [
  {
    path: '',
    component: InvestorLayout,
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'portfolio', loadComponent: () => import('./investments/investments').then(m => m.Investments) },
      { path: 'kyc', loadComponent: () => import('./kyc/kyc').then(m => m.Kyc) },
      { path: 'wallet', loadComponent: () => import('./wallets/wallets').then(m => m.Wallets) },
      { path: 'ledger', loadComponent: () => import('./audit-logs/audit-logs').then(m => m.AuditLogs) },
      { path: 'plans', loadComponent: () => import('./explore-plans/explore-plans').then(m => m.ExplorePlans) },
      { path: 'rewards', loadComponent: () => import('./referrals/referrals').then(m => m.Referrals) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

