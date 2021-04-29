import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  private lastname :string;
  private firstname :string;
  
  constructor( public auth :AuthService,  // --aot
	       private router :Router ) {}

  cartDisplay() {
     this.router.navigate(['/cart', {outlets:{'cartDisplay': ['display', 0]}}]);
  }
  
}
