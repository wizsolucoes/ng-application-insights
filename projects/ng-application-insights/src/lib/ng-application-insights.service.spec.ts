import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import {
  NgApplicationInsightsConfig,
  NgApplicationInsightsService,
} from './ng-application-insights.service';

import { RouterTestingModule } from '@angular/router/testing';
import { NgApplicationInsightsComponent } from './ng-application-insights.component';
import { Router } from '@angular/router';

describe('NgApplicationInsightsService', () => {
  let router: Router;
  let service: NgApplicationInsightsService;
  let fixture: ComponentFixture<NgApplicationInsightsComponent>;

  describe('service is enabled', () => {
    const mockAICOnfig = new NgApplicationInsightsConfig();
    mockAICOnfig.enabled = true;
    mockAICOnfig.instrumentationKey = '';

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        providers: [
          {
            provide: NgApplicationInsightsConfig,
            useValue: mockAICOnfig,
          },
        ],
      });
      service = TestBed.inject(NgApplicationInsightsService);
      fixture = TestBed.createComponent(NgApplicationInsightsComponent);
      router = TestBed.inject(Router);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should instantiate ApplicationInsights when constucted', () => {
      expect(service.appInsights).toBeTruthy();
    });

    it('should call trackPageView on navigation', fakeAsync(() => {
      // Given
      spyOn(service.appInsights, 'trackPageView');

      // When
      fixture.ngZone.run(() => {
        router.initialNavigation();
      });

      // Then
      tick();
      expect(service.appInsights.trackPageView).toHaveBeenCalled();
    }));

    it('should call trackPageView on navigation', fakeAsync(() => {
      // Given
      spyOn(service.appInsights, 'trackException');

      // When
      service.trackException(new Error('some error'));

      // Then
      tick();
      expect(service.appInsights.trackException).toHaveBeenCalled();
    }));
  });

  describe('service is disabled', () => {
    const mockAICOnfig = new NgApplicationInsightsConfig();
    mockAICOnfig.enabled = false;
    mockAICOnfig.instrumentationKey = '';

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        providers: [
          {
            provide: NgApplicationInsightsConfig,
            useValue: mockAICOnfig,
          },
        ],
      });
      service = TestBed.inject(NgApplicationInsightsService);
    });

    it('should NOT instantiate ApplicationInsights when constucted', () => {
      expect(service.appInsights).not.toBeTruthy();
    });

    it('should NOT call appInsights trackPageView', fakeAsync(() => {
      // When
      service.trackPageView('test', '/test');

      // Then
      expect(service.appInsights).not.toBeTruthy();
    }));

    it('should NOT call appInsights trackException', fakeAsync(() => {
      // When
      service.trackException(new Error('test'));

      // Then
      expect(service.appInsights).not.toBeTruthy();
    }));
  });
});
