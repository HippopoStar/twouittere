import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AuthService } from '../../auth.service';
import { ArticlesService } from '../articles.service';

interface ArticleInterface {
  author: string;
  content: string;
  publication_date: string;
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


  loadArticles(): void {
    let logMessage: string = "Dans la fonction \"loadArticles\": ";
    let receivedArticles: Array<ArticleInterface>|null = null;
    let articleDate: Date|null = null;
    this.articles.loadTen().subscribe(serverResponse => {
      if (serverResponse.status !== undefined && typeof(serverResponse.status) === "string"
        && serverResponse.status === "success" && (receivedArticles = serverResponse.result) !== null) {
        //receivedArticles = serverResponse.result;
        console.log(logMessage + JSON.stringify(serverResponse));
        if (receivedArticles.length > 0) {
          this.articles.last_article_date = receivedArticles[receivedArticles.length - 1].publication_date;
          for (let elem of receivedArticles) {
            articleDate = new Date(elem["publication_date"]);
            elem["publication_date"] = articleDate.toDateString() + " at " + articleDate.toTimeString();
            this.articlesFeed.push(elem);
          }
        }
        else {
          console.log(logMessage + "No matching articles found");
        }
      }
      else {
        console.log(logMessage + "Request couldn't achieve");
      }
    });
  }

}
