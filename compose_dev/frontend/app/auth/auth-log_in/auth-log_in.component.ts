import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService, AuthRequestResponseInterface } from '../../auth.service';

@Component({
  selector: 'app-auth-log-in',
  templateUrl: './auth-log_in.component.html',
  styleUrls: ['./auth-log_in.component.css']
})
export class AuthLogInComponent {
  public login: string|null = null;
  public password: string|null = null;
  public errorMessage: string = "";

  constructor(public auth: AuthService) {}

  onSubmit() {
    const logMessage = "Dans la fonction onSubmit du composant 'auth-log_in': ";

      /* ---------- TEST 01 ----------------------------------------------------------------- */

//      // Just for a quick test (voir fichier './EI2ANGNOD/APPLICATION_FIL_ROUGE/README.md')
//      if ((this.login === "pompidor") && (this.password === "2fast4U")) {
//          this.auth.isLoggedIn = true;
//          this.auth.firstname = "Pierre";
//          this.auth.lastname = "POMPIDOR";
//          this.auth.email = "pompidor@lirmm.fr";
//      }
//      //else if (...

      /* ---------- AUTHENTICATION ---------------------------------------------------------- */

      if ((this.login !== null) && (this.password !== null)) {
          console.log(this.login+" "+this.password);
          this.auth.isLoggedIn = false;

          this.auth.authentication(this.login, this.password).subscribe(
            (res: AuthRequestResponseInterface) => {
              this.auth.requestResponse = res;
              console.log(JSON.stringify(this.auth.requestResponse));
              if ( this.auth.requestResponse !== null && this.auth.requestResponse["status"] === "success"
                && !(this.auth.requestResponse["content"] === undefined) )
              {
                  this.auth.isLoggedIn = true;
                  this.auth.email = this.login;
                  this.auth.password = this.password;
                  this.auth.firstname = this.auth.requestResponse["content"]["firstname"];
                  this.auth.lastname = this.auth.requestResponse["content"]["lastname"];
                  this.errorMessage = "";
              }
              else {
                this.errorMessage = "Authentication failed: invalid login or password";
              }
            },
            (err: HttpErrorResponse) => {
              this.errorMessage = "Communication error: unreachable server";
            },
            () => {
              console.log(logMessage + "Request completed");
            }
         );
      }
      else {
        this.errorMessage = "Authentication failed: invalid field(s)";
      }
  }

  logout() {
      this.auth.isLoggedIn = false;
  }

}

