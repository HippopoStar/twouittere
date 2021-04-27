import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../auth.service';
import { ArticlesService } from '../articles.service';

@Component({
  selector: 'app-articles-redact',
  templateUrl: './articles-redact.component.html',
  styleUrls: ['./articles-redact.component.css']
})
export class ArticlesRedactComponent {
  public login: string|null = null;
  public redact: string|null = null;
  public errorMessage: string = "";

  constructor(public auth: AuthService, public articles: ArticlesService) {}

  onSubmit() {

    /* ---------- PUBLISH ----------------------------------------------------------------- */

    if (!(this.redact === null)) {
      this.articles.publishRedact(this.redact).subscribe(res => {
        if (res.status === "success") {
          console.log("ARTICLE PUBLIE AVEC SUCCES:\n");
          console.log(this.auth.email + ": " + this.redact);
          this.errorMessage = "";
          this.hide_redact_form();
          this.redact = "";
        }
        else {
          this.errorMessage = "Publication failed: see backend";
        }
      });
    }
    else {
      this.errorMessage = "Publication failed: invalid field(s)";
    }

  }

  display_redact_form() {
    this.articles.isPublishing = false;
  }

  hide_redact_form() {
    this.articles.isPublishing = true;
  }

}

