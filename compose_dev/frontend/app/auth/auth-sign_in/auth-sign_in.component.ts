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
  private nomEtPrenom: string[] = [];

  constructor(public auth: AuthService) {}

  onSubmit() {

      /* ---------- REGISTERING ------------------------------------------------------------- */

      const re = /^(\w+)$/;

      if (!(this.login === null) && re.test(this.login)
        && !(this.password === null) && re.test(this.password)
        && !(this.firstname === null) && re.test(this.firstname)
        && !(this.lastname === null) && re.test(this.lastname)) {
          console.log(this.login+" "+this.password+" "+this.firstname+" "+this.lastname);
          this.auth.isSigningIn = true;

          this.auth.register(this.login, this.password, this.firstname, this.lastname).subscribe(res => this.nomEtPrenom = res);
          if ( this.nomEtPrenom.length > 0 ) {
              console.log(JSON.stringify(this.nomEtPrenom));
              this.auth.isLoggedIn = true;
              this.auth.firstname = this.nomEtPrenom[0];
              this.auth.lastname = this.nomEtPrenom[1];
              this.auth.email = this.login;
              this.hide_signin_form();
          }

      }

  }

  display_signin_form() {
      this.auth.isSigningIn = true;
  }

  hide_signin_form() {
      this.auth.isSigningIn = false;
  }

}

