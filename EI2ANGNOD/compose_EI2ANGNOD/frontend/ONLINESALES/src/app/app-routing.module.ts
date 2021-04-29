import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResearchComponent } from './research//research.component';
import { CartComponent } from './cart/cart.component';

import { ResearchModule } from './research/research.module';
import { CartModule } from './cart/cart.module';

import { AuthGuardService } from './auth-guard.service';


const routes: Routes = [
  {
    path: 'research',
    loadChildren: './research/research.module#ResearchModule'
  },
  {
    path: 'cart',
    loadChildren: './cart/cart.module#CartModule',
    canActivate: [AuthGuardService]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }

