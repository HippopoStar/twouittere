import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export interface AuthenticationDataInterface {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface AuthRequestResponseInterface {
  status: string;
  content?: AuthenticationDataInterface;
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

  constructor(private http: HttpClient) {
    const logMessage: string = "Dans le constructeur du service 'auth.service': ";
    console.log(logMessage + "Appel");
  }

  public checkBackendServerAddress(callback?: Function): void {
    const logMessage: string = "Dans la fonction 'checkBackendServerAddress': ";
    console.log(logMessage + "Appel");
    this.http.get<AuthRequestResponseInterface>(this.backend_server_url+"/auth/login=default/password=default").subscribe(
      (param: AuthRequestResponseInterface) => {
        console.log("backend server reached successfully at address: " + this.backend_server_url);
        if (callback) {
          console.log("callback: " + callback.name);
          callback();
        }
      },
      (err: HttpErrorResponse) => {
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
          + '<a href="' + this.backend_server_url + '/">' + this.backend_server_url + '/</a>'
          + " ou " + '<a href="' + this.backend_server_url_bis + '/">' + this.backend_server_url_bis + '/</a>'
          + " si vous naviguez depuis l'hebergeur), et rechargez la page.";
  }

  // Dans cet exemple nous n'utilisons pas le serveur https (?)
  public authentication(login: string, password: string): Observable<AuthRequestResponseInterface> {
    const logMessage: string = "Dans la methode 'authentication' du service 'auth.service': ";
    console.log(logMessage + "login="+login+" password="+password);
    let url: string = this.backend_server_url+"/auth/login="+login+"/password="+password;
    return this.http.get<AuthRequestResponseInterface>(url);
  }

  public register(login: string, password: string, firstname: string, lastname: string) : Observable<AuthRequestResponseInterface> {
    const logMessage: string = "Dans la methode 'registering' du service 'auth.service': ";
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
    console.log(logMessage + JSON.stringify(req));
    return this.http.post<AuthRequestResponseInterface>(url, JSON.stringify(req), httpOptions);
  }

}

