import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticlesRedactComponent } from './articles-redact/articles-redact.component';
import { ArticlesFeedComponent } from './articles-feed/articles-feed.component';
import { ArticlesInteractionsComponent } from './articles-interactions/articles-interactions.component';
import { ArticlesEditComponent } from './articles-edit/articles-edit.component';

import { AuthGuardService } from '../auth-guard.service';

//import { NamedOutletDirective } from './named-outlet.directive';

const routes: Routes = [
  {
    path: 'redact',
    component: ArticlesRedactComponent,
    outlet: 'articlesRedact',
    canActivate: [AuthGuardService]
  },
  {
    path: 'feed',
    component: ArticlesFeedComponent,
    outlet: 'articlesFeed'
  },
  {
    path: 'feed/:action',
    component: ArticlesFeedComponent,
    outlet: 'articlesFeed'
  },
  {
    path: 'interactions',
    component: ArticlesInteractionsComponent,
    outlet: 'articlesInteractions',
    canActivate: [AuthGuardService]
  },
  {
    path: 'interactions/:action/:id',
    component: ArticlesInteractionsComponent,
    outlet: 'articlesInteractions',
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
