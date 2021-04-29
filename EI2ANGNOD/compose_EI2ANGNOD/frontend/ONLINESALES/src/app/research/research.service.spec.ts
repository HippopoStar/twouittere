/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReseachService } from './research.service';

describe('ResearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResearchService]
    });
  });

  it('should ...', inject([ResearchService], (service: ResearchService) => {
    expect(service).toBeTruthy();
  }));
});
