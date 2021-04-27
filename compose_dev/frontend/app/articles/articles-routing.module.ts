import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticlesRedactComponent } from './articles-redact/articles-redact.component';
import { ArticlesFeedComponent } from './articles-feed/articles-feed.component';

import { AuthGuardService } from '../auth-guard.service';

const routes: Routes = [
  {
    path: 'redact',
    component: ArticlesRedactComponent,
    outlet: 'articlesRedact',
    canActivate: [AuthGuardService]
  },
  {
    path: 'feed/:action',
    component: ArticlesFeedComponent,
    outlet: 'articlesFeed'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
