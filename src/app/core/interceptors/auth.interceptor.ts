import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ProAppConfigService } from '@totvs/protheus-lib-core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const proAppConfig = inject(ProAppConfigService);

  if (!proAppConfig.insideProtheus()) {
    const authReq = req.clone({
      setHeaders: {
        'Authorization': `${getToken('ADMIN', '1234')}`
      }
    })

    return next(authReq);
  }
  return next(req);
};

function getToken(user: string, password: string): string {
  return `Basic ${btoa(`${user}:${password}`)}`;
}
