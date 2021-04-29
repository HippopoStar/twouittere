import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../auth.service';
import { ResearchService } from "../../research/research.service";
import { CartService } from "../cart.service";


@Component({
  templateUrl: './cart-management.component.html',
  styleUrls: ['./cart-management.component.css']
})
export class CartManagementComponent implements OnInit {
  private email :string;
  public product :any;  // --aot
  private name :string = "inconnu";
  public action :string;  // --aot

  private numAction :number = 1;

  constructor( private identification :AuthService,
               private cart :CartService,
               private research :ResearchService,	       
               private route :ActivatedRoute,
	       private router :Router ) {
     this.email = identification.email;
  }

  ngOnInit() {
     console.log("Dans le composant CartManagement avec email="+this.email);
     this.route.params.subscribe(params => {
          this.cartProductManagement(params["action"], params["id"]);
     });
  }

  cartProductManagement(action, productId) {
     this.research.getProductById(productId)
                  .subscribe(res => this.product = res,
                             err => console.error(err),
                             () => console.log('getProductById() done'));     
     if (action == "add") this.action = "Ajout";
     if (action == "remove") this.action = "Retrait";
     console.log("Dans managementCartProduct avec action="+action+" et parameters=productId="+productId+"/email="+this.email);
     this.cart.modifyCart(action, productId, this.email)
              .subscribe(res => { console.log("Demande de raffraîchissement du panier ("+this.numAction+")"),
                                  this.router.navigate(['/cart', {outlets:{'cartDisplay': ['display', this.numAction]}}]);
				  this.numAction++;
                                },
                         err => console.error(err),
                         () => console.log('modifyCart() done'));
  }

}
