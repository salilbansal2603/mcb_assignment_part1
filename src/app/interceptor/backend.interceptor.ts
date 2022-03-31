import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { users } from '../../assets/json/user.json';

@Injectable({
  providedIn: 'root'
})
export class BackendInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) 
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/login') && method === 'POST':
          return authenticate();
        /*case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();*/
        default:
          return next.handle(request);
      }

    }
    function authenticate() {
      const { username, password } = body;
      const user = users.find(x => x.userName === username && x.password === password);
      if (!user) return error('Username or password is incorrect');
      return ok({
        username: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: `jwt-token.${user.userName}`
      });
    }

    // helper functions

    function ok(body) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'unauthorized' } });
    }

    function error(message) {
      return throwError({ status: 400, error: { message } });
    }

    function isLoggedIn() {
      const authHeader = headers.get('Authorization') || '';
      return authHeader.startsWith('Bearer jwt-token');
    }

    function isAdmin() {
      return isLoggedIn() && currentUser().role === "ADMIN";
    }

    function currentUser() {
      if (!isLoggedIn()) return;
      const id = headers.get('Authorization').split('.')[1];
      return users.find(x => x.userName === id);
    }
  }
}


export const BackendServProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: BackendInterceptor,
  multi: true
};