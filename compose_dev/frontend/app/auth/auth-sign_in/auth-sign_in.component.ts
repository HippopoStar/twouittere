import { Component } from '@angular/core';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-auth-sign-in',
  templateUrl: './auth-sign_in.component.html',
  styleUrls: ['./auth-sign_in.component.css']
})
export class AuthSignInComponent {
  public login: string|null = null;
  public password: string|null = null;
  public firstname: string|null = null;
  public lastname: string|null = null;
  public errorMessage: string = "";

  constructor(public auth: AuthService) {}

  onSubmit() {
    const logMessage: string = "Dans la fonction OnSubmit du composant 'auth-sign_in': ";

    /* ---------- REGISTERING ------------------------------------------------------------- */

    const reEmailString = "/^(\\w+)((\\.{1})(\\w+))?(@(\\w+)\\.(\\w{2,3})$/"
    const reWordString = "/^(\\w+)$/"
    const reEmail = /^(\w+)((\.{1})(\w+))?@(\w+)\.(\w{2,3})$/;
    const reWord = /^(\w+)$/;

    if (!(this.login === null) && reEmail.test(this.login)
      && !(this.password === null) && reWord.test(this.password)
      && !(this.firstname === null) && reWord.test(this.firstname)
      && !(this.lastname === null) && reWord.test(this.lastname))
    {
      console.log(this.login+" "+this.password+" "+this.firstname+" "+this.lastname);
      this.auth.isSigningIn = true;

      this.auth.register(this.login, this.password, this.firstname, this.lastname).subscribe(
        (res) => {
          if (res !== undefined) {
            this.auth.requestResponse = res;
            console.log(JSON.stringify(this.auth.requestResponse));
            if ( this.auth.requestResponse !== null && this.auth.requestResponse["status"] === "success" ) {
              this.auth.isLoggedIn = true;
              this.auth.email = this.login;
              this.auth.password = this.password;
              this.auth.firstname = this.firstname;
              this.auth.lastname = this.lastname;
              this.errorMessage = "";
              this.hide_signin_form();
            }
            else {
              this.errorMessage = "Registration failed: existing user";
            }
          }
          else {
            this.errorMessage = this.auth.getUnreachableServerMessage();
          }
        },
        (err: string) => {
          this.errorMessage = "Communication error: unreachable server";
        },
        () => {
          console.log(logMessage + "Request completed");
        }
      );
    }
    else {
      this.errorMessage = "Registration failed: invalid field(s)\n"
        + "expected login: " + reEmailString + "\n"
        + "expected other fields: " + reWordString;
    }

  }

  display_signin_form() {
      this.auth.isSigningIn = true;
  }

  hide_signin_form() {
      this.auth.isSigningIn = false;
  }

}

