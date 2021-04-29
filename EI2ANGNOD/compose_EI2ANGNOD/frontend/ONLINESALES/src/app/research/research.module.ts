import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResearchComponent } from './research.component';
import { ProductSelectionbycriteriaComponent } from './product-selectionbycriteria/product-selectionbycriteria.component';
import { ProductSelectionbykeywordsComponent } from './product-selectionbykeywords/product-selectionbykeywords.component';
import { ProductDisplayComponent } from './product-display/product-display.component';
import { ResearchService } from './research.service';

import { SortPipe } from './sort.pipe';
import { EvenOddPipe } from './even-odd.pipe';

import { ResearchRoutingModule } from './research-routing.module';


@NgModule({
  imports:      [CommonModule, ResearchRoutingModule],
  declarations: [ResearchComponent,
                 ProductSelectionbycriteriaComponent,
                 ProductSelectionbykeywordsComponent,
                 ProductDisplayComponent,
                 SortPipe,
                 EvenOddPipe],
  exports:      [ResearchComponent],
  providers:    [ResearchService],
  bootstrap:    [ResearchComponent]
})
export class ResearchModule { }
