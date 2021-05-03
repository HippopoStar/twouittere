import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Observable, throwError, Subscription } from 'rxjs';

import { AsyncPipe } from '@angular/common';

import { AuthService } from '../../auth.service';
import { ArticlesService, ArticleInterface } from '../articles.service';


@Component({
  selector: 'app-articles-feed',
  templateUrl: './articles-feed.component.html',
  styleUrls: ['./articles-feed.component.css']
})
export class ArticlesFeedComponent implements OnInit, OnDestroy {

//  public articlesFeed: Array<ArticleInterface> = [];
//  public articlesFeedObserver: Subscription; //OBSERVER
//  public articlesFeedChangesCount: number = 0;

  constructor(public articles: ArticlesService, public auth: AuthService, private route: ActivatedRoute, private router: Router) {
    /* Relating to: OUTLET AUTO-REFRESH */
//    const logMessage: string = "Dans le constucteur de la classe 'ArticlesFeedComponent': ";
//
//    this.articlesFeedObserver = this.articles.articlesFeed$.asObservable().subscribe(
//      (param: Array<ArticleInterface>) => {
//        console.log(logMessage + "articlesFeedObserver - param:\n" + JSON.stringify(param));
//        this.articlesFeedChangesCount++;
//        console.log(logMessage + "articlesFeedChangesCount: " + JSON.stringify(this.articlesFeedChangesCount));
//      },
//      (err: string) => { console.log(logMessage + "articlesFeedObserver - err:\n" + JSON.stringify(err)) },
//      () => { console.log(logMessage + "articlesFeedObserver - Observation completed") }
//    ); //OBSERVER

  }

  ngOnInit(): void {
    let logMessage: string = "Dans la fonction ngOnInit du composant 'articles-feed': ";
    console.log(logMessage + "Appel");

    /* Relating to: OUTLET INVOCATION */
//    this.route.params.subscribe(
//      (params: Params) => {
//        console.log(logMessage + "params: " + JSON.stringify(params));
//	    this.articlesFeedManagement(params["action"]);
//      },
//      (err) => {
//        console.log(logMessage + "An error occured with the route invocation:" + err);
//      },
//      () => {
//        console.log(logMessage + "route invocation completed");
//      }
//    );

    /* Relating to: OUTLET AUTO-REFRESH */
//    this.articles.articlesFeed$.asObservable().subscribe(
//      (param: Array<ArticleInterface>) => {
//        console.log(logMessage + "articlesFeed$:\n" + JSON.stringify(param));
//        this.articlesFeedChangesCount++;
//        console.log(logMessage + "articlesFeedChangesCount: " + JSON.stringify(this.articlesFeedChangesCount));
//      },
//      (err: string) => { console.log(logMessage + "articlesFeedObserver - err:\n" + JSON.stringify(err)) },
//      () => { console.log(logMessage + "articlesFeedObserver - Observation completed") }
//    ); //OBSERVER

  }


  articlesFeedManagement(action?: string): void {
    const logMessage: string = "Dans la fontion 'articlesFeedManagement': ";
    console.log(logMessage + "Appel");
    if (action === undefined) {
      console.log(logMessage + "refreshing 'article-feed' component");
    }
    else {
      console.log(logMessage + action);
      if (action === "load") {
        this.articles.loadArticles();
      }
      else if (action === "refresh") {
        this.articles.refreshArticles();
      }
      else {
        console.log(logMessage + "Unknown action");
      }
    }
  }

  ngOnDestroy(): void {
    /* Relating to: OUTLET AUTO-REFRESH */
//    const logMessage: string = "Dans la fonction ngOnDestroy du composant 'articles-feed': ";
//    console.log(logMessage + "Appel");
//    this.articlesFeedObserver.unsubscribe(); //OBSERVER
  }

}
