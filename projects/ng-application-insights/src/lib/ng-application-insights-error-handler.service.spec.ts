import { TestBed } from '@angular/core/testing';

import { NgApplicationInsightsErrorHandler } from './ng-application-insights-error-handler.service';
import {
  NgApplicationInsightsConfig,
  NgApplicationInsightsService,
} from './ng-application-insights.service';

describe('NgApplicationInsightsErrorHandler', () => {
  let service: NgApplicationInsightsErrorHandler;
  let mockNgApplicationInsightsService: jasmine.SpyObj<NgApplicationInsightsService>;

  describe('application insights service is disabled', () => {
    beforeEach(() => {
      mockNgApplicationInsightsService = jasmine.createSpyObj(
        'NgApplicationInsightsService',
        ['trackException']
      );

      TestBed.configureTestingModule({
        providers: [
          {
            provide: NgApplicationInsightsService,
            useValue: mockNgApplicationInsightsService,
          },
          {
            provide: NgApplicationInsightsConfig,
            useValue: { enabled: true, instrumentationKey: '' },
          },
        ],
      });
      service = TestBed.inject(NgApplicationInsightsErrorHandler);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should call ngApplicationInsightsService #trackException', () => {
      // Given
      const error = new Error('fake error');

      // When
      service.handleError(error);

      // Then
      expect(
        mockNgApplicationInsightsService.trackException
      ).toHaveBeenCalled();
    });
  });

  describe('application insights service is disabled', () => {
    beforeEach(() => {
      mockNgApplicationInsightsService = jasmine.createSpyObj(
        'NgApplicationInsightsService',
        ['trackException']
      );

      TestBed.configureTestingModule({
        providers: [
          {
            provide: NgApplicationInsightsService,
            useValue: mockNgApplicationInsightsService,
          },
          {
            provide: NgApplicationInsightsConfig,
            useValue: { enabled: false, instrumentationKey: '' },
          },
        ],
      });
      service = TestBed.inject(NgApplicationInsightsErrorHandler);
    });

    it('should NOT call monitoringService #logException', () => {
      // Given
      const error = new Error('fake error');
      spyOn(console, 'error').and.callFake(() => {});

      // When
      service.handleError(error);

      // Then
      expect(
        mockNgApplicationInsightsService.trackException
      ).not.toHaveBeenCalled();
    });
  });
});
