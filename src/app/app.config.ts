import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideZonelessChangeDetection(), // This replaces the need for Zone.js

    provideHttpClient(withInterceptors([authInterceptor])
    ),

    importProvidersFrom(
      NgxsModule.forRoot([], {
        developmentMode: true,
      }),

      NgxsReduxDevtoolsPluginModule.forRoot({
        name: 'TopEquity Admin',
        disabled: false,
      }),
    ),
  ],
};
