import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  public login: string|null = null;
  public password: string|null = null;
  private nomEtPrenom: string[] = [];

  constructor(public auth: AuthService) {}
  
  onSubmit() {

      // Just for a quick test (voir fichier './EI2ANGNOD/APPLICATION_FIL_ROUGE/README.md')
      if ((this.login === "pompidor") && (this.password === "2fast4U")) {
          this.auth.isLoggedIn = true;
          this.auth.firstname = "Claire";
          this.auth.lastname = "DELUNE";
          this.auth.email = "delune@lirmm.fr";
      }

      else if ((this.login !== null) && (this.password !== null)) {
          console.log(this.login+" "+this.password);
          this.auth.isLoggedIn = false;

          this.auth.authentification(this.login, this.password).subscribe(res => this.nomEtPrenom = res);
          if ( this.nomEtPrenom.length > 0 ) {
              this.auth.isLoggedIn = true;
              this.auth.firstname = this.nomEtPrenom[0];
              this.auth.lastname = this.nomEtPrenom[1];
              this.auth.email = this.login;
          }

      }
  }

  logout() {
      this.auth.isLoggedIn = false;
  }

}

