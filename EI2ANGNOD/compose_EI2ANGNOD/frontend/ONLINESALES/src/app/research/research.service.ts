import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ResearchService {

  constructor(private http: HttpClient) {}

  getProductById(id :string) :Observable<any> {
     console.log("Dans research.service.getProductById() => /Product/id="+id);	
     let url :string = "http://localhost:8888/Product/id="+id;
     return this.http.get(url);
  }

  // Recherche par critères ou par mots clefs
  getProducts(parametres :string) :Observable<any> {
     console.log("Dans getProducts avec "+parametres);
     let url :string = "http://localhost:8888/Products/"+parametres;
     return this.http.get(url);
  }

}
