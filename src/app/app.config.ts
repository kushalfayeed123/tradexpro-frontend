import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/jwt.interceptor';
import { AuthState } from './auth/state/auth.state';
import { UsersState } from './admin/pages/users/state/users.state';
import { TransactionsState } from './admin/pages/transactions/state/transaction.state';
import { InvestmentPlansState } from './admin/pages/investment-plans/state/investment-plans.state';
import { InvestmentState } from './admin/pages/investments/state/investments.state';
import { SettingsState } from './admin/pages/settings/state/settings.state';
import { OverviewState } from './investor/dashboard/state/overview.state';
import { InvestorTransactionState } from './investor/wallets/state/transactions/transactions.state';
import { ExploreInvestmentState } from './investor/explore-plans/state/explore-investment.state';
import { MyInvestmentsState } from './investor/investments/state/user-investment.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideZonelessChangeDetection(), // This replaces the need for Zone.js

    provideHttpClient(withFetch(), withInterceptors([authInterceptor])
    ),

    importProvidersFrom(
      NgxsModule.forRoot([AuthState,
        UsersState,
        TransactionsState,
        InvestmentPlansState,
        InvestmentState,
        SettingsState,
        OverviewState,
        TransactionsState,
        InvestorTransactionState,
        ExploreInvestmentState,
        MyInvestmentsState], {
        developmentMode: true,
      }),

      NgxsReduxDevtoolsPluginModule.forRoot({
        name: 'TopEquity Admin',
        disabled: false,
      }),
    ),
  ],
};
