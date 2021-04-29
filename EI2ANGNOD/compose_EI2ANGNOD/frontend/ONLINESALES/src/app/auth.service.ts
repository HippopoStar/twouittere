import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;
  email: string;
  firstname: string;
  lastname: string;

  constructor(private http: HttpClient) {}

  // Dans cet exemple nous n'utilisons pas le serveur https
  authentification(login, password): Observable<any> {
    console.log("Dans auth.service.ts avec login="+login+" password="+password);
    let url: string = "http://localhost:8888/auth/login="+login+"/password="+password;
    return this.http.get(url);
  }
}
