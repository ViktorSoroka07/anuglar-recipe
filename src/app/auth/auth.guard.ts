import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const ls = window.localStorage;

    if (this.authService.isFirstPageLoad) {
      this.authService.isFirstPageLoad = false;

      const authUserKey = Object.keys(ls).find(item => item.startsWith('firebase:authUser'));

      if (!authUserKey) {
        this.router.navigate(['/signin']);
        return false;
      }

      const token = JSON.parse(ls.getItem(authUserKey)).stsTokenManager.accessToken;

      this.authService.setToken(token);
      return Boolean(token);
    }

    const isAuthenticated = this.authService.isAuthenticated();

    if (!isAuthenticated) {
      this.router.navigate(['/signin']);
      return false;
    }

    return isAuthenticated;
  }
}
