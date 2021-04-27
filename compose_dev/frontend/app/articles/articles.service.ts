import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';


export interface ArticleInterface {
  author: string;
  content: string;
  publication_date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  public isPublishing: boolean = false;
  public last_article_date: string = "None";

  constructor(private http: HttpClient, public auth: AuthService) { }

  publishRedact(parameters: string): Observable<any> {
    console.log("Appel de \"publishRedact\"");
    let url: string = this.auth.backend_server_url+"/articles/publish";
    let req: Object = {
      "login": this.auth.email,
      "password": this.auth.password,
      "content": parameters
    };
    let httpOptions: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(url, JSON.stringify(req), httpOptions);
  }

  refreshArticles(articlesFeedComponentTab: Array<ArticleInterface>): void {
    articlesFeedComponentTab = [];
    this.last_article_date = "None";
    this.loadArticles(articlesFeedComponentTab);
  }

  loadArticles(articlesFeedComponentTab: Array<ArticleInterface>): void {
    let logMessage: string = "Dans la fonction \"loadArticles\": ";
    let receivedArticles: Array<ArticleInterface>|null = null;
    let articleDatePrinter: Date|null = null;
    this.loadTen().subscribe(serverResponse => {
      if (serverResponse.status !== undefined && typeof(serverResponse.status) === "string"
        && serverResponse.status === "success" && (receivedArticles = serverResponse.result) !== null) {
        //receivedArticles = serverResponse.result;
        console.log(logMessage + JSON.stringify(serverResponse));
        if (receivedArticles.length > 0) {
          this.last_article_date = receivedArticles[receivedArticles.length - 1].publication_date;
          for (let elem of receivedArticles) {
            articleDatePrinter = new Date(elem["publication_date"]);
            elem["publication_date"] = articleDatePrinter.toDateString() + " at " + articleDatePrinter.toTimeString();
            articlesFeedComponentTab.push(elem);
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

  loadTen(): Observable<any> {
    console.log("Appel de \"loadTen\"");
    let url: string = this.auth.backend_server_url+"/articles/feed";
    return this.http.get(url
      +"/login="+(this.auth.email || "default")
      +"/password="+(this.auth.password || "default")
      +"/last_article_date="+this.last_article_date);
  }



}
