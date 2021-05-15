import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../../auth.service';
import { ArticlesService, ArticleInterface } from '../articles.service';

@Component({
  selector: 'app-articles-interactions',
  templateUrl: './articles-interactions.component.html',
  styleUrls: ['./articles-interactions.component.css']
})
export class ArticlesInteractionsComponent implements OnInit {

  constructor(public articles: ArticlesService, public auth: AuthService, public router: Router, public route: ActivatedRoute) {
    const logMessage: string = "Dans le constructeur du composant 'articles-interactions.component': ";
    console.log(logMessage + "Appel");
  }

  ngOnInit(): void {
    const logMessage: string = "Dans la fonction ngOnInit du composant 'articles-interactions': ";
    console.log(logMessage + "Appel");

    /* Relating to: OUTLET INVOCATION */
    this.route.params.subscribe(
      (params: Params) => {
        console.log(logMessage + "params: " + JSON.stringify(params));
	    this.articlesInteractionsManagement(params["action"], params["id"]);
      },
      (err: any) => {
        console.log(logMessage + "An error occured with the route invocation:" + JSON.stringify(err));
      },
      () => {
        console.log(logMessage + "route invocation completed");
      }
    );

  }

  articlesInteractionsManagement(action?: string, id?: string): void {
    const logMessage: string = "Dans la fontion 'articlesInteractionsManagement': ";
    console.log(logMessage + "Appel");
    let article: ArticleInterface|null = null;

    if (action === undefined) {
      console.log(logMessage + "refreshing 'article-interactions' component");
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
        const nav: Array<any> = [
          '/articles',
          {
            outlets: {
              ["articlesEdit-" + id]: ['edit', id]
            }
          }
        ];
        console.log(logMessage + JSON.stringify(nav));
        //this.router.navigate(['/articles', { outlets: { 'articlesFeed': ['feed', 'refresh'] } }]);
        //this.router.navigate(['/articles', { outlets: { ["articlesEdit-" + id]: ['edit', id] } }]);
        //this.router.navigate(nav);
        //this.router.navigate(['/articles', 'edit', id]);
        this.articles.articleToEditId = id;
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
