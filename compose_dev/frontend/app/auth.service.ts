import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;
  email: string|null = null;
  firstname: string|null = null;
  lastname: string|null = null;

  constructor(private http: HttpClient) {}

  // Dans cet exemple nous n'utilisons pas le serveur https
  authentification(login: string, password: string): Observable<any> {
    console.log("Dans auth.service.ts avec login="+login+" password="+password);
    let url: string = "https://127.0.0.1:3000/auth/login="+login+"/password="+password;
    return this.http.get(url);
  }
}

