import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../auth.service';
import { ArticlesService } from '../articles.service';


@Component({
  selector: 'app-articles-redact',
  templateUrl: './articles-redact.component.html',
  styleUrls: ['./articles-redact.component.css']
})
export class ArticlesRedactComponent implements OnInit {
  public login: string|null = null;
  public redact: string|null = null;
  public errorMessage: string = "";

  constructor(public auth: AuthService, public articles: ArticlesService, public router: Router, public route: ActivatedRoute) {}

  ngOnInit(): void {
    const logMessage: string = "Dans la fonction ngOnInit du composant 'articles-redact': ";
    console.log(logMessage + "Appel");
    this.route.params.subscribe(
      (params: Params) => {
        console.log(logMessage + "params: " + JSON.stringify(params));
      },
      (err) => {
        console.log(logMessage + "An error occured with the route invocation: " + err);
      },
      () => {
        console.log(logMessage + "route invocation completed");
      }
    );
  }

  onSubmit() {

    const logMessage: string = "Dans la fonction onSubmit du composant 'articles-redact': ";
    console.log(logMessage + "Appel");

    /* ---------- PUBLISH ----------------------------------------------------------------- */

    if (!(this.redact === null)) {
      this.articles.publishRedact(this.redact).subscribe(res => {
        if (res.status === "success") {
          console.log("ARTICLE PUBLIE AVEC SUCCES:\n");
          console.log(this.auth.email + ": " + this.redact);
          this.hide_redact_form();
          this.redact = "";
          this.errorMessage = "";

//          this.articles.displayFeed(['refresh'])
//            .then(
//              (param: boolean) => {
//                console.log(logMessage + "promise (param): " + JSON.stringify(param));
//              })
//            .catch(
//              (err) => {
//                console.log(logMessage + "promise (err): " + err);
//              }
//            );

          this.articles.refreshArticles();

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

