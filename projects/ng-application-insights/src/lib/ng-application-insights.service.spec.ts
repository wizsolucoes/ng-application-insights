import { TestBed } from '@angular/core/testing';

import { NgApplicationInsightsService } from './ng-application-insights.service';

describe('NgApplicationInsightsService', () => {
  let service: NgApplicationInsightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgApplicationInsightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
