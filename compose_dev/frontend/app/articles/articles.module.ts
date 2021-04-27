import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesComponent } from './articles.component';
import { ArticlesRedactComponent } from './articles-redact/articles-redact.component';
import { ArticlesFeedComponent } from './articles-feed/articles-feed.component';

import { AuthService } from '../auth.service';
import { AuthGuardService } from '../auth-guard.service';

import { ArticlesService } from './articles.service';

@NgModule({
  declarations: [
    ArticlesComponent,
    ArticlesRedactComponent,
    ArticlesFeedComponent
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    FormsModule,
  ],
  exports: [ArticlesComponent],
  providers: [
    AuthService,
    AuthGuardService,
    ArticlesService
  ],
  bootstrap: [ArticlesComponent]
})
export class ArticlesModule { }
