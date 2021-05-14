import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesInteractionsComponent } from './articles-interactions.component';

describe('ArticlesInteractionsComponent', () => {
  let component: ArticlesInteractionsComponent;
  let fixture: ComponentFixture<ArticlesInteractionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesInteractionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesInteractionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
