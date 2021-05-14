import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../../auth.service';
import { ArticlesService, ArticleInterface } from '../articles.service';

@Component({
  selector: 'app-articles-edit',
  templateUrl: './articles-edit.component.html',
  styleUrls: ['./articles-edit.component.css']
})
export class ArticlesEditComponent implements OnInit {

  constructor(public articles: ArticlesService, public auth: AuthService, public router: Router, public route: ActivatedRoute) {
    const logMessage: string = "Dans le constructeur du composant 'articles-edit.component': ";
    console.log(logMessage + "Appel");
  }

  ngOnInit(): void {
    const logMessage: string = "Dans la fonction ngOnInit du composant 'articles-edit': ";
    console.log(logMessage + "Appel");

    /* Relating to: OUTLET INVOCATION */
    this.route.params.subscribe(
      (params: Params) => {
        console.log(logMessage + "params: " + JSON.stringify(params));
	    this.articlesEditManagement(params["action"], params["id"]);
      },
      (err: any) => {
        console.log(logMessage + "An error occured with the route invocation:" + JSON.stringify(err));
      },
      () => {
        console.log(logMessage + "route invocation completed");
      }
    );

  }

  articlesEditManagement(action?: string, id?: string): void {
    const logMessage: string = "Dans la fontion 'articlesEditManagement': ";
    console.log(logMessage + "Appel");
    let article: ArticleInterface|null = null;

    if (action === undefined) {
      console.log(logMessage + "refreshing 'article-edit' component");
    }
    else if (id === undefined) {
      console.log(logMessage + "action: " + action + " - missing target's id");
    }
    else {
      console.log(logMessage + action);
      if (action === "edit") {
//        this.articles.editArticles();
        article = this.articles.getArticleById(id);
        console.log(logMessage + JSON.stringify(article));
//        console.log(logMessage + "articles.articlesFeed$.value: " + JSON.stringify(this.articles.articlesFeed$.value));
//        console.log(logMessage + "articles.articlesFeed: " + JSON.stringify(this.articles.articlesFeed));
      }
      else if (action === "refresh") {
        this.articles.refreshArticles();
      }
      else {
        console.log(logMessage + "Unknown action");
      }
    }
  }

}
