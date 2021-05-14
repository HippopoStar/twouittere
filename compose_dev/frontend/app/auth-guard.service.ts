import { Injectable } from '@angular/core';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, 
       } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public authService :AuthService,
              public router :Router) {
    const logMessage: string = "Dans le constructeur du service 'auth-guard.service': ";
    console.log(logMessage + "Appel");
  }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  canActivate(): boolean {
     const logMessage: string = "Dans la fonction 'canActivate' du service 'auth-guard.service': ";
     console.log(logMessage + "Appel");
     //this.authService.redirectUrl = state.url;
     return this.checkLogin();
  }

  checkLogin(): boolean {
     const logMessage: string = "Dans la fonction 'checkLogin' du service 'auth-guard.service': ";
     console.log(logMessage + "Appel");
     console.log(logMessage + "authService.isLoggedIn: " + JSON.stringify(this.authService.isLoggedIn));
     if (this.authService.isLoggedIn) { return true; }
     this.router.navigate(['/auth', { outlets: {'authLogIn': ['log_in'] } }]);
     return false;
  }
}

