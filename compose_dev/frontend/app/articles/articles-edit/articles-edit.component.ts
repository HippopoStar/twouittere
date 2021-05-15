import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../../auth.service';
import { ArticlesService, ArticleInterface } from '../articles.service';

//import { NamedOutletDirective } from '../named-outlet.directive';

@Component({
  selector: 'app-articles-edit',
  templateUrl: './articles-edit.component.html',
  styleUrls: ['./articles-edit.component.css']
})
export class ArticlesEditComponent implements OnInit {
  public redact: string = "";
  public publicationMaxLength: number = 500;
  public targetArticleObject: ArticleInterface|null = null;
//  public targetArticleId: string|null = null;
//  public isPublishing: boolean = false;
  public errorMessage: string = "";
  public re_articleId: RegExp = /^(\w{24})$/;

  constructor(public auth: AuthService, public articles: ArticlesService, public router: Router, public route: ActivatedRoute) {
    const logMessage: string = "Dans le constructeur du composant 'articles-edit': ";
    console.log(logMessage + "Appel");
  }

  ngOnInit(): void {
    const logMessage: string = "Dans la fonction 'ngOnInit' du composant 'articles-edit': ";
    console.log(logMessage + "Appel");

    /* Relating to: OUTLET INVOCATION */
//    this.route.params.subscribe(
//      (params: Params) => {
//        console.log(logMessage + "params: " + JSON.stringify(params));
//            this.articlesEditManagement(params["id"]);
//      },
//      (err: any) => {
//        console.log(logMessage + "An error occured with the route invocation:" + JSON.stringify(err));
//      },
//      () => {
//        console.log(logMessage + "route invocation completed");
//      }
//    );

    console.log(logMessage + "articles.articleToEditId: " + this.articles.articleToEditId);
    console.log(logMessage + "re_articleId.test(articles.articleToEditId): " + JSON.stringify(this.re_articleId.test(this.articles.articleToEditId)));
//    if (!(this.articles.articleToEditId === null || this.targetArticleId === null)
//      && this.articles.articleToEditId === this.targetArticleId)
    if (!(this.articles.articleToEditId === null) && this.re_articleId.test(this.articles.articleToEditId))
    {
      this.targetArticleObject = this.articles.getArticleById(this.articles.articleToEditId);
      this.redact = (!(this.targetArticleObject === null) && typeof(this.targetArticleObject.content) === "string") ? this.targetArticleObject.content : "Something went wrong";
    }
  }

  /* ---------- EDIT -------------------------------------------------------------------- */
  onSubmit(): void {
    const logMessage: string = "Dans la fonction 'onSubmit' du composant 'articles-edit': ";
    console.log(logMessage + "Appel");
//    if (!(this.articles.articleToEditId === null || this.targetArticleId === null)
//      && this.articles.articleToEditId === this.targetArticleId
//      && !(this.redact === null || this.redact.length > this.publicationMaxLength))
    if (!(this.articles.articleToEditId === null) && this.re_articleId.test(this.articles.articleToEditId)
      && !(this.redact === null || this.redact.length > this.publicationMaxLength))
    {
      this.articles.publishEdit(this.redact, this.articles.articleToEditId).subscribe(
        (res: any) => {
          console.log(logMessage + "res: " + JSON.stringify(res));
          if (res.status === "success") {
//            this.hide_redact_form();
            this.cancel_edit_form();
            this.articles.refreshArticles();
          }
          else {
            this.errorMessage = "Publication failed: see backend";
          }
        },
        (err: HttpErrorResponse) => {
          console.log(logMessage + "err: " + JSON.stringify(err));
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

  /* Relating to: OUTLET INVOCATION */
//  articlesEditManagement(id?: string): void {
//    const logMessage: string = "Dans la fontion 'articlesEditManagement': ";
//    console.log(logMessage + "Appel");
//    let article: ArticleInterface|null = null;
//
//    if (id === undefined) {
//      console.log(logMessage + " - missing target's id");
//    }
//    else {
////      this.articles.editArticles();
//      article = this.articles.getArticleById(id);
//      console.log(logMessage + JSON.stringify(article));
////      console.log(logMessage + "articles.articlesFeed$.value: " + JSON.stringify(this.articles.articlesFeed$.value));
////      console.log(logMessage + "articles.articlesFeed: " + JSON.stringify(this.articles.articlesFeed));
//    }
//  }

  cancel_edit_form() {
    this.router.navigate(['/']);
    this.articles.articleToEditId = "None";
  }

//  display_redact_form() {
//    this.articles.isPublishing = false;
//  }
//
//  hide_redact_form() {
//    this.articles.isPublishing = true;
//  }

}
