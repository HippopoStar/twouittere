import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-selectionbykeywords',
  templateUrl: './product-selectionbykeywords.component.html',
  styleUrls: ['./product-selectionbykeywords.component.css']
})
export class ProductSelectionbykeywordsComponent {

  constructor( private router: Router) {}
    
  productSelection( terms: string ): void {
    this.router.navigate(["/research", {outlets: {"display": ["display", terms]}}]);
  }
}
