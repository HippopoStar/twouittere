import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { map } from 'rxjs/operators';

import { ResearchService } from "../research.service";


@Component({
  selector: 'app-product-display',
  templateUrl: './product-display.component.html',
  styleUrls: ['./product-display.component.css']
})
export class ProductDisplayComponent implements OnInit {
  public products :Object[];  // --aot
  private subscribe :any;
 
  constructor (private research :ResearchService, private route: ActivatedRoute) {}

  ngOnInit() {
     this.route.params.subscribe((params :Params) => {
          console.log("Dans ProductDisplayComponent !");
          let subroute = "";
          if (params["type"] !== undefined) {
              console.log("dans le composant product-display avec "+params['type']+"/"+params['brand']+"/"+params['minprice']+"/"+params['maxprice']+"/"+params['minpopularity']);
              subroute = "criteria/"+params['type']+"/"+params['brand']+"/"+params['minprice']+"/"+params['maxprice']+"/"+params['minpopularity'];
          }
          else {
              console.log("dans le composant product-display avec "+params['terms']);
              subroute = "keywords?"+params["terms"].split(" "	  ).join("&");
          }

          this.research.getProducts(subroute)
              .subscribe(res => this.products = res,
                         err => console.error(err),
                         () => console.log('getProducts done'));       
                     
          });
  }

}
