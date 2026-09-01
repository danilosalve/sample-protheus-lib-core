import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('ERPTOKEN');

  if (!token) {
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
