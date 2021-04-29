import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-cart-validation',
  templateUrl: './cart-validation.component.html',
  styleUrls: ['./cart-validation.component.css']
})
export class CartValidationComponent implements OnInit {

  constructor( private route: ActivatedRoute ) { }

  ngOnInit() {
     this.route.params.subscribe(params => { console.log("Validation du panier"); });
  }

}
