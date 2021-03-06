import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../auth.service';
import { ArticlesService } from '../articles.service';


@Component({
  selector: 'app-articles-redact',
  templateUrl: './articles-redact.component.html',
  styleUrls: ['./articles-redact.component.css']
})
export class ArticlesRedactComponent implements OnInit {
  public login: string|null = null;
  public redact: string = "";
  public publicationMaxLength: number = 500;
  public errorMessage: string = "";

  constructor(public auth: AuthService, public articles: ArticlesService, public router: Router, public route: ActivatedRoute) {
    const logMessage: string = "Dans le constructeur du composant 'articles-redact.component': ";
    console.log(logMessage + "Appel");
  }

  ngOnInit(): void {
    const logMessage: string = "Dans la fonction ngOnInit du composant 'articles-redact': ";
    console.log(logMessage + "Appel");

    /* Relating to: OUTLET INVOCATION */
//    this.route.params.subscribe(
//      (params: Params) => {
//        console.log(logMessage + "params: " + JSON.stringify(params));
//      },
//      (err: any) => {
//        console.log(logMessage + "An error occured with the route invocation: " + JSON.stringify(err));
//      },
//      () => {
//        console.log(logMessage + "route invocation completed");
//      }
//    );

  }

  onSubmit() {

    const logMessage: string = "Dans la fonction onSubmit du composant 'articles-redact': ";
    console.log(logMessage + "Appel");

    /* ---------- PUBLISH ----------------------------------------------------------------- */

    if (!(this.redact === null || this.redact.length > this.publicationMaxLength)) {
      this.articles.publishRedact(this.redact).subscribe(
        (res: any) => {
          if (res.status === "success") {
            console.log("ARTICLE PUBLIE AVEC SUCCES:\n");
            console.log(this.auth.email + ": " + this.redact);
            this.hide_redact_form();
            this.redact = "";
            this.errorMessage = "";

            /* Relating to: OUTLET INVOCATION */
//            this.articles.displayFeed(['refresh'])
//              .then(
//                (param: boolean) => {
//                  console.log(logMessage + "promise (param): " + JSON.stringify(param));
//                })
//              .catch(
//                (err) => {
//                  console.log(logMessage + "promise (err): " + err);
//                }
//              );

            this.articles.refreshArticles();

          }
          else {
            this.errorMessage = "Publication failed: see backend";
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

