import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  public backend_server_url: string = "https://127.0.0.1:3000";
  public isLoggedIn: boolean = false;
  public isSigningIn: boolean = false;
  public email: string|null = null;
  public password: string|null = null;
  public firstname: string|null = null;
  public lastname: string|null = null;

  constructor(private http: HttpClient) {}

  // Dans cet exemple nous n'utilisons pas le serveur https (?)
  authentification(login: string, password: string): Observable<any> {
    console.log("Dans auth.service.ts avec login="+login+" password="+password);
    let url: string = this.backend_server_url+"/auth/login="+login+"/password="+password;
    return this.http.get(url);
  }

  register(login: string, password: string, firstname: string, lastname: string) : Observable<any> {
    console.log("Dans la methode 'registering' de auth.service.ts");
    let url: string = this.backend_server_url+"/auth";
    let req: Object = {
      "login": login,
      "password": password,
      "firstname": firstname,
      "lastname": lastname
    };
    let httpOptions: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(url, JSON.stringify(req), httpOptions);
  }

}

