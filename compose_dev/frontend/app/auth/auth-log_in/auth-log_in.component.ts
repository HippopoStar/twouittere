import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-auth-log-in',
  templateUrl: './auth-log_in.component.html',
  styleUrls: ['./auth-log_in.component.css']
})
export class AuthLogInComponent {
  public login: string|null = null;
  public password: string|null = null;
  private nomEtPrenom: string[] = [];
  public errorMessage: string = "";

  constructor(public auth: AuthService) {}

  onSubmit() {

      /* ---------- TEST 01 ----------------------------------------------------------------- */

//      // Just for a quick test (voir fichier './EI2ANGNOD/APPLICATION_FIL_ROUGE/README.md')
//      if ((this.login === "pompidor") && (this.password === "2fast4U")) {
//          this.auth.isLoggedIn = true;
//          this.auth.firstname = "Pierre";
//          this.auth.lastname = "POMPIDOR";
//          this.auth.email = "pompidor@lirmm.fr";
//      }
//      //else if (...

      /* ---------- AUTHENTIFICATION -------------------------------------------------------- */

      if ((this.login !== null) && (this.password !== null)) {
          console.log(this.login+" "+this.password);
          this.auth.isLoggedIn = false;

          this.auth.authentification(this.login, this.password).subscribe(res => this.nomEtPrenom = res);
          if ( this.nomEtPrenom.length > 0 ) {
              console.log(JSON.stringify(this.nomEtPrenom));
              this.auth.isLoggedIn = true;
              this.auth.firstname = this.nomEtPrenom[0];
              this.auth.lastname = this.nomEtPrenom[1];
              this.auth.email = this.login;
              this.errorMessage = "";
          }
          else {
            this.errorMessage = "Authentification failed: invalid login or password";
          }

      }
      else {
        this.errorMessage = "Authentification failed: invalid field(s)";
      }
  }

  logout() {
      this.auth.isLoggedIn = false;
  }

}

