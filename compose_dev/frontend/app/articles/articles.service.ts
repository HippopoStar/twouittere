import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';


@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  public lastLoadedArticle: string = "None";

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

  loadTen(): Observable<any> {
    console.log("Appel de \"loadTen\"");
    let url: string = this.auth.backend_server_url+"/articles/feed";
    return this.http.get(url
      +"/login="+(this.auth.email || "default")
      +"/password="+(this.auth.password || "default")
      +"/lastLoadedArticle="+this.lastLoadedArticle);
  }

}
