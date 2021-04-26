import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesRedactComponent } from './articles-redact.component';

describe('ArticlesRedactComponent', () => {
  let component: ArticlesRedactComponent;
  let fixture: ComponentFixture<ArticlesRedactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesRedactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesRedactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
