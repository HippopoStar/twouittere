import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


export interface ArticleInterface {
  _id: string;
  author: string;
  content: string;
//  content_lines?: Array<string>;
  publication_date: string;
}

export interface ArticlesServerResponseInterface {
  status: string;
  result: Array<ArticleInterface>;
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  public isPublishing: boolean = false;
//  public articlesFeed: Array<ArticleInterface> = [];
  public articlesFeed$: BehaviorSubject<ArticleInterface[]> = new BehaviorSubject<ArticleInterface[]>([]); //Observable
  public last_article_date: string = "None";
  public last_article_id: string = "None";
  public errorMessage: string = "";

  constructor(private http: HttpClient, public auth: AuthService, public router: Router) {
  }

  /* https://angular.io/guide/http#handling-request-errors */
  private handleError(error: HttpErrorResponse) {

    this.errorMessage = this.auth.unreachableServerMessage;
    console.log(this.errorMessage);
//    alert(this.errorMessage);

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

  public displayRedact(args?: Array<string>): Promise<boolean> {
    const logMessage: string = "Dans la fonction 'displayRedact': ";
    let navigationParameters: Array<string> = ['redact'];
    if (args !== undefined) {
      for (let navigationParameter of args) {
        navigationParameters.push(navigationParameter);
      }
    }
    console.log(logMessage + "navigationParameters: " + JSON.stringify(navigationParameters));
    return this.router.navigate(['/articles', { outlets: { 'articlesRedact': navigationParameters } }]);
  }

  public displayFeed(args?: Array<string>): Promise<boolean> {
    const logMessage: string = "Dans la fonction 'displayFeed': ";
    let navigationParameters: Array<string> = ['feed'];
    if (args !== undefined) {
      for (let navigationParameter of args) {
        navigationParameters.push(navigationParameter);
      }
    }
    console.log(logMessage + "navigationParameters: " + JSON.stringify(navigationParameters));
    return this.router.navigate(['/articles', { outlets: { 'articlesFeed': navigationParameters } }]);
  }

  public publishRedact(parameters: string): Observable<any> {
    const logMessage: string = "Dans la fonction 'publishRedact': ";
    console.log(logMessage + "Appel");
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
    if (this.auth === undefined) {
      console.log(logMessage + "auth undefined");
    }
    else {
      console.log(logMessage + "auth.email: " + JSON.stringify(this.auth.email));
      console.log(logMessage + "auth.password: " + JSON.stringify(this.auth.password));
      console.log(logMessage + "re: " + JSON.stringify(req));
    }
    return this.http.post(url, JSON.stringify(req), httpOptions);
  }

  public refreshArticles(): void {
    const logMessage: string = "Dans la fonction 'refrehArticles': ";
    console.log(logMessage + "Appel");
//    this.articlesFeed = [];
    this.articlesFeed$.next([]); //Observable
    this.last_article_date = "None";
    this.last_article_id = "None";
    this.loadArticles();
  }

  public loadArticles(): void {
    const logMessage: string = "Dans la fonction 'loadArticles': ";
    console.log(logMessage + "Appel");
    let receivedArticles: Array<ArticleInterface>|null = null;
    let articleDatePrinter: Date|null = null;
    this.loadTen().subscribe(
      (serverResponse: ArticlesServerResponseInterface) => {
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
//              //elem["content_lines"] = elem["content"].split(/\n/);
//              //elem["content"] = elem["content"].replace(/\n/g, "<br/>");
//              this.articlesFeed.push(elem);
            }
            console.log("articlesFeed$.value:\n" + JSON.stringify(this.articlesFeed$.value)); //Observable
//            Array.prototype.push.apply(this.articlesFeed$.value, receivedArticles); //Observable bad practice - read-only attribute
//            console.log("articlesFeed$.value:\n" + JSON.stringify(this.articlesFeed$.value)); //Observable bad practice - read-only attribute
//            this.articlesFeed$.next(this.articlesFeed$.value); //Observable bad practive - read-only attribute
            this.articlesFeed$.next(this.articlesFeed$.value.concat(receivedArticles)); //Observable
            console.log("articlesFeed$.value:\n" + JSON.stringify(this.articlesFeed$.value)); //Observable
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
      },
      (errorResponse: HttpErrorResponse) => {
        console.log(logMessage + "Appel de 'articles.handleError'");
        this.handleError(errorResponse);
      },
      () => {
        console.log(logMessage + "Requete completee");
      });
  }

  /* https://angular.io/guide/http#reading-the-full-response */
  public loadTen(): Observable<ArticlesServerResponseInterface> {
    const logMessage: string = "Dans la fonction 'loadTen': ";
    console.log(logMessage + "Appel");
    let url: string = this.auth.backend_server_url+"/articles/feed";
    return this.http.get<ArticlesServerResponseInterface>(url
      +"/login="+(this.auth.email || "default")
      +"/password="+(this.auth.password || "default")
      +"/last_article_date="+(this.last_article_date || "None")
      +"/last_article_id="+(this.last_article_id || "None")
    );
  }


}

