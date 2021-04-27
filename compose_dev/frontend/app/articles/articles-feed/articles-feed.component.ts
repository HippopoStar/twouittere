import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../auth.service';
import { ArticlesService, ArticleInterface } from '../articles.service';


@Component({
  selector: 'app-articles-feed',
  templateUrl: './articles-feed.component.html',
  styleUrls: ['./articles-feed.component.css']
})
export class ArticlesFeedComponent implements OnInit {

  public articlesFeed: Array<ArticleInterface> = [];

  constructor(private articles: ArticlesService, public auth: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    let logMessage: string = "Appel de ngOnInit du composant 'articles-feed'";
    console.log(logMessage);
/*
    this.route.params.subscribe((params: Params) => {
      console.log(JSON.stringify(params));
      this.articlesFeedManagement(params["action"]);
    });
*/
    this.articlesFeedManagement("load");
  }

  articlesFeedManagement(action: string): void {
    let logMessage: string = "Dans la fontion \"articlesFeedManagement\": ";
    console.log(logMessage + action);
    if (action === "load") {
      this.articles.loadArticles(this.articlesFeed);
    }
    else if (action === "refresh") {
      this.articles.refreshArticles(this.articlesFeed);
    }
    else {
      console.log(logMessage + "Unknown action");
    }
  }

}
