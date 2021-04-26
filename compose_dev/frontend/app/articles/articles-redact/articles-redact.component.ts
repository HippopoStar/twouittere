import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-articles-redact',
  templateUrl: './articles-redact.component.html',
  styleUrls: ['./articles-redact.component.css']
})
export class ArticlesRedactComponent {
  public login: string|null = null;
  public redact: string|null = null;
  public errorMessage: string = "";

  constructor(public auth: AuthService) {}

  onSubmit() {

      /* ---------- PUBLISH ----------------------------------------------------------------- */

      if (!(this.redact === null)) {
          console.log(this.auth.email + ": " + this.redact);
          this.errorMessage = "";

      }
      else {
        this.errorMessage = "Publication failed: invalid field(s)";
      }

  }


}

