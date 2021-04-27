import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AuthService } from '../../auth.service';
import { ArticlesService } from '../articles.service';

interface ArticleInterface {
  author: String;
  content: String;
}

@Component({
  selector: 'app-articles-feed',
  templateUrl: './articles-feed.component.html',
  styleUrls: ['./articles-feed.component.css']
})
export class ArticlesFeedComponent implements OnInit {
  public articlesFeed: Array<ArticleInterface> = [];

  constructor(private articles: ArticlesService, public auth: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.loadArticles();
  }

  pushReverseTab (currentTab: Array<ArticleInterface>, toAddTab: Array<ArticleInterface>) {
    let i: number;

    i = toAddTab.length - 1;
    while (i >= 0) {
      currentTab.push(toAddTab[i]);
      i--;
    }
  }

  loadArticles(): void {
    let logMessage: string = "Dans la fonction \"loadArticles\": ";
    let receivedArticles: Array<ArticleInterface>|null = null;
    this.articles.loadTen().subscribe(serverResponse => {
      if (serverResponse.status !== undefined && typeof(serverResponse.status) === "string"
        && serverResponse.status === "success" && (receivedArticles = serverResponse.result) !== null) {
        //receivedArticles = serverResponse.result;
        console.log(logMessage + JSON.stringify(serverResponse));
//        for (let elem of receivedArticles) {
//          this.articlesFeed.push(elem);
//        }
        this.pushReverseTab(this.articlesFeed, receivedArticles);
      }
      else {
        console.log(logMessage + "Rien ne va plus");
      }
    });
  }

}
