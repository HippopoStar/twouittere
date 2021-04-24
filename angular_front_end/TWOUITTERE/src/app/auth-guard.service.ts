import { Injectable } from '@angular/core';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, 
       } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public authService :AuthService,
              public router :Router) {
  }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  canActivate(): boolean {
     //this.authService.redirectUrl = state.url;
     return this.checkLogin();
  }

  checkLogin(): boolean {
     if (this.authService.isLoggedIn) { return true; }
     this.router.navigate([{outlets: {'login': ['login']}}]);
     return false;
  }
}

