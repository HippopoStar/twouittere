import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthentificationDataInterface {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface AuthRequestResponseInterface {
  status: string;
  content: AuthentificationDataInterface;
}

@Injectable()
export class AuthService {
  public backend_server_url: string = "https://127.0.0.1:3002";
  public backend_server_url_bis: string = "https://twouittere.hopto.org:3002";
  public isLoggedIn: boolean = false;
  public isSigningIn: boolean = false;
  public email: string|null = null;
  public password: string|null = null;
  public firstname: string|null = null;
  public lastname: string|null = null;
  public requestResponse: AuthRequestResponseInterface|null = null;

  constructor(private http: HttpClient) { }

  public checkBackendServerAddress(callback?: Function): void {
    const logMessage: string = "Dans la fonction 'checkBackendServerAddress': ";
    console.log(logMessage + "Appel");
    this.http.get(this.backend_server_url+"/auth/login=default/password=default").subscribe(
      (param: any) => {
        console.log("backend server reached successfully at address: " + this.backend_server_url);
        if (callback) {
          console.log("callback: " + callback.name);
          callback();
        }
      },
      (err: any) => {
        let tmp:string = this.backend_server_url;
        this.backend_server_url = this.backend_server_url_bis;
        this.backend_server_url_bis = tmp;
        console.log("failed to reach backend server at address: " + this.backend_server_url_bis + " - address changed for: " + this.backend_server_url);
        if (callback) {
          console.log("callback: " + callback.name);
          callback();
        }
      },
      () => {
        console.log("backend server address check completed");
//        if (callback) {
//          console.log("callback: " + callback.name);
//          callback();
//        }
      }
    );
  }

  public getUnreachableServerMessage(): string {
    return "Serveur injoignable. Essayez de vous connecter au serveur back-end depuis votre navigateur "
          + "afin d'accepter manuellement le certificat auto-signe ("
          + this.backend_server_url
          + " ou " + this.backend_server_url_bis
          + " si vous naviguez depuis l'hebergeur), et rechargez la page.";
  }

  // Dans cet exemple nous n'utilisons pas le serveur https (?)
  public authentification(login: string, password: string): Observable<any> {
    console.log("Dans auth.service.ts avec login="+login+" password="+password);
    let url: string = this.backend_server_url+"/auth/login="+login+"/password="+password;
    return this.http.get(url);
  }

  public register(login: string, password: string, firstname: string, lastname: string) : Observable<any> {
    console.log("Dans la methode 'registering' de auth.service.ts");
    let url: string = this.backend_server_url+"/auth/register";
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

