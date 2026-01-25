import { Routes } from '@angular/router';
import { InvestorLayout } from './layout/investor-layout/investor-layout';


export const INVESTOR_ROUTES: Routes = [
  {
    path: '',
    component: InvestorLayout,
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

