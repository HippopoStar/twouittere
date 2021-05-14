import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { ArticlesComponent } from './articles.component';
import { ArticlesRedactComponent } from './articles-redact/articles-redact.component';
import { ArticlesFeedComponent } from './articles-feed/articles-feed.component';
import { ArticlesEditComponent } from './articles-edit/articles-edit.component';

import { ArticlesRoutingModule } from './articles-routing.module';

@NgModule({
  declarations: [
    ArticlesComponent,
    ArticlesRedactComponent,
    ArticlesFeedComponent,
    ArticlesEditComponent
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    FormsModule
  ],
  exports: [ArticlesComponent],
  providers: [],
  bootstrap: [ArticlesComponent]
})
export class ArticlesModule { }
