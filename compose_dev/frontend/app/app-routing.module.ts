import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './auth-guard.service';

import { AuthComponent } from './auth/auth.component';
import { ArticlesComponent } from './articles/articles.component';

import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: 'articles',
    loadChildren: './articles/articles.module#ArticlesModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
