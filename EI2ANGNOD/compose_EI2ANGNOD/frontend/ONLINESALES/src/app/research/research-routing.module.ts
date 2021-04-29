import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductDisplayComponent } from './product-display/product-display.component';

import { ModuleWithProviders }  from '@angular/core';

const routes: Routes = [
    { path: 'display/:type/:brand/:minprice/:maxprice/:minpopularity', component: ProductDisplayComponent, outlet: 'display'},
    { path: 'display/:terms', component: ProductDisplayComponent, outlet: 'display'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ResearchRoutingModule { }
