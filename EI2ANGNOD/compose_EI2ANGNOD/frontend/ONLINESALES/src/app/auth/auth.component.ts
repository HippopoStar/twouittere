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
  private login: string;
  private password: string;
  private nomEtPrenom: string[] = [];

  constructor(public auth: AuthService) {}
  
  onSubmit() {
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

  logout() {
      this.auth.isLoggedIn = false;
  }

}
