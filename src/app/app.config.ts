import { provideRouter } from '@angular/router';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { PoHttpRequestModule } from '@po-ui/ng-components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([authInterceptor])),
    importProvidersFrom([BrowserAnimationsModule, PoHttpRequestModule, ProtheusLibCoreModule]),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};
