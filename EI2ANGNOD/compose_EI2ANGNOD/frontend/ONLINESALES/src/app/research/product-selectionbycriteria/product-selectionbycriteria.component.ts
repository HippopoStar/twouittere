import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ResearchService } from "../research.service";


@Component({
  selector: 'app-product-selectionbycriteria',
  templateUrl: './product-selectionbycriteria.component.html',
  styleUrls: ['./product-selectionbycriteria.component.css']
})
export class ProductSelectionbycriteriaComponent implements OnInit {
  public selectors :Object[];  // --aot
  private params :any = {"type":"*", "brand":"*", "minprice":"*", "maxprice":"*", "minpopularity":"*"};  


  constructor(private research :ResearchService, private router :Router) {}

  ngOnInit() {        
     this.research.getProducts("selectors")
         .subscribe(res => this.selectors = res,
                    err => console.error(err),
                    ()  => console.log('getProducts("selectors") done'));
  }

  selection($event, selector) {
     let selectElement = $event.target;
     let optionIndex = selectElement.selectedIndex;
     let optionText = selectElement.options[optionIndex].text;
     console.log("Dans selection avec "+selector+"="+ optionText + " sélectionné !");
     console.log("Dans selection avec "+this.params.type+" "+this.params.brand+" "+this.params.minprice+" "+this.params.maxprice+" "+this.params.minpopularity);
     
     if (selector == optionText) {
        if (selector == "price") {
	    this.params["minprice"] = "*";
	    this.params["maxprice"] = "*";	    
        }
	else this.params[selector] = "*";
	selectElement.style.backgroundColor = "#F5F3F3";
     }
     else {
        if (selector == "price") {
            let price = /(.+) - (.+)/.exec(optionText);
	    this.params["minprice"] = price[1];
	    this.params["maxprice"] = price[2];
        }     
	else this.params[selector] = optionText;
        selectElement.style.backgroundColor = "yellow";
     }
     console.dir(this.params);
  }

  productSelection() {
     console.log("Dans productSelection avec "+this.params.type+" "+this.params.brand+" "+this.params.minprice+" "+this.params.maxprice+" "+this.params.minpopularity);
     this.router.navigate(['/research', {outlets: {'display': ['display', this.params.type, this.params.brand, this.params.minprice, this.params.maxprice, this.params.minpopularity]}}]);
  }
}
