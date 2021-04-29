import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


export interface ArticleInterface {
  _id: string;
  author: string;
  content: string;
  publication_date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  public isPublishing: boolean = false;
  public articlesFeed: Array<ArticleInterface> = [];
  public last_article_date: string = "None";
  public last_article_id: string = "None";
  public errorMessage = "";

  constructor(private http: HttpClient, public auth: AuthService, public router: Router) { }

  /* https://angular.io/guide/http#handling-request-errors */
  private handleError(error: HttpErrorResponse) {
    this.errorMessage = this.auth.unreachableServerMessage;
    alert(this.errorMessage);
    this.router.navigate(['/articles', { outlets: { 'articlesFeed': ['feed']}}]); //INVESTIGATION: this.router is undefined ?

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  public publishRedact(parameters: string): Observable<any> {
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

  public refreshArticles(): void {
    this.articlesFeed = [];
    this.last_article_date = "None";
    this.last_article_id = "None";
    this.loadArticles();
  }

  public loadArticles(): void {
    let logMessage: string = "Dans la fonction \"loadArticles\": ";
    let receivedArticles: Array<ArticleInterface>|null = null;
    let articleDatePrinter: Date|null = null;
    this.loadTen().subscribe(serverResponse => {
      if (serverResponse.status !== undefined && typeof(serverResponse.status) === "string"
        && serverResponse.status === "success" && (receivedArticles = serverResponse.result) !== null) {
        //receivedArticles = serverResponse.result; /* Voir condition ci-dessus */
        console.log(logMessage + JSON.stringify(serverResponse));
        if (receivedArticles.length > 0) {

          this.last_article_date = receivedArticles[receivedArticles.length - 1].publication_date;
          this.last_article_id = receivedArticles[receivedArticles.length - 1]._id;

          for (let elem of receivedArticles) {
            articleDatePrinter = new Date(elem["publication_date"]);
            elem["publication_date"] = articleDatePrinter.toDateString() + " at " + articleDatePrinter.toTimeString();
            this.articlesFeed.push(elem);
          }
          this.errorMessage = "";
        }
        else {
          this.errorMessage = logMessage + "No matching articles found";
          console.log(this.errorMessage);
        }
      }
      else {
        this.errorMessage = logMessage + "Request couldn't achieve";
        console.log(this.errorMessage);
      }
    });
  }

  public loadTen(): Observable<any> {
    console.log("Appel de \"loadTen\"");
    let url: string = this.auth.backend_server_url+"/articles/feed";
    return this.http.get(url
      +"/login="+(this.auth.email || "default")
      +"/password="+(this.auth.password || "default")
      +"/last_article_date="+(this.last_article_date || "None")
      +"/last_article_id="+(this.last_article_id || "None"),
    ).pipe(
      catchError(this.handleError)
    );
  }


}

