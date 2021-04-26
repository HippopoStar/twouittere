import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';


@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

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

}
