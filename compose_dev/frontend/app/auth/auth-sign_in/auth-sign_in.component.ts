import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

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

    /* ---------- REGISTERING ------------------------------------------------------------- */

    const reEmailString = "/^(\\w+)@(\\w+)\\.(\\w{2,3})$/"
    const reWordString = "/^(\\w+)$/"
    const reEmail = /^(\w+)@(\w+)\.(\w{2,3})$/;
    const reWord = /^(\w+)$/;

    if (!(this.login === null) && reEmail.test(this.login)
      && !(this.password === null) && reWord.test(this.password)
      && !(this.firstname === null) && reWord.test(this.firstname)
      && !(this.lastname === null) && reWord.test(this.lastname)) {
      console.log(this.login+" "+this.password+" "+this.firstname+" "+this.lastname);
      this.auth.isSigningIn = true;

      this.auth.register(this.login, this.password, this.firstname, this.lastname).subscribe(res => {
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
      });
    }
    else {
      this.errorMessage = "Registration failed: invalid field(s)"
        + " login: " + reEmailString
        + " other fields: " + reWordString;
    }

  }

  display_signin_form() {
      this.auth.isSigningIn = true;
  }

  hide_signin_form() {
      this.auth.isSigningIn = false;
  }

}

