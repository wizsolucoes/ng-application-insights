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
import { IExceptionTelemetry } from '@microsoft/applicationinsights-web';

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
  });

  describe('service is enabled for non white label applications', () => {
    const mockAICOnfig = new NgApplicationInsightsConfig();
    mockAICOnfig.enabled = true;
    mockAICOnfig.instrumentationKey = '';
    mockAICOnfig.whiteLabel = false;

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

    it('should create IExceptionTelemetry and call appInsights trackException', () => {
      // Given
      const error = new Error('some error');
      spyOn(service.appInsights, 'trackException');

      // When
      service.trackException(error);

      // Then
      const exception: IExceptionTelemetry = {
        exception: error,
        properties: {},
      };

      expect(service.appInsights.trackException).toHaveBeenCalledWith(
        exception
      );
    });

    it('should call trackEvent with event and custom properties', () => {
      // Given
      spyOn(service.appInsights, 'trackEvent');

      // When
      service.trackEvent({ name: 'testEvent' }, { foo: 'bar' });

      // Then
      expect(service.appInsights.trackEvent).toHaveBeenCalledWith(
        { name: 'testEvent' },
        { foo: 'bar' }
      );
    });
  });

  describe('service is enabled for white label applications', () => {
    const mockAICOnfig = new NgApplicationInsightsConfig();
    mockAICOnfig.enabled = true;
    mockAICOnfig.instrumentationKey = '';
    mockAICOnfig.whiteLabel = true;

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

    it('should call trackPageView on navigation', fakeAsync(() => {
      // Given
      spyOn(service.appInsights, 'trackPageView');
      service.setCustomProperty('SomeProperty', 'some-value');

      // When
      fixture.ngZone.run(() => {
        router.initialNavigation();
      });

      // Then
      tick();
      expect(service.appInsights.trackPageView).toHaveBeenCalledWith({
        name: null,
        uri: '/',
        properties: { 'SomeProperty': 'some-value' }
      });
    }));

    it('should create IExceptionTelemetry and call appInsights trackException', () => {
      // Given
      const error = new Error('some error');
      spyOn(service.appInsights, 'trackException');
      service.setCustomProperty('SomeProperty', 'some-value');

      // When
      service.trackException(error);

      // Then
      const exception: IExceptionTelemetry = {
        exception: error,
        properties: {
          'SomeProperty': 'some-value',
        }
      };

      expect(service.appInsights.trackException).toHaveBeenCalledWith(
        exception
      );
    });

    it('should call trackEvent with event and custom properties', () => {
      // Given
      spyOn(service.appInsights, 'trackEvent');
      service.setCustomProperty('SomeProperty', 'some-value');

      // When
      service.trackEvent({ name: 'testEvent' }, { foo: 'bar' });

      // Then
      expect(service.appInsights.trackEvent).toHaveBeenCalledWith(
        { name: 'testEvent' },
        { foo: 'bar', 'SomeProperty': 'some-value' }
      );
    });
  });

  describe('service is disabled', () => {
    const mockAICOnfig = new NgApplicationInsightsConfig();
    mockAICOnfig.enabled = false;
    mockAICOnfig.instrumentationKey = '';
    mockAICOnfig.whiteLabel = !!Math.round(Math.random());

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

    it('should NOT call appInsights trackEvent', fakeAsync(() => {
      // When
      service.trackEvent({ name: 'testEvent' }, { foo: 'bar' });

      // Then
      expect(service.appInsights).not.toBeTruthy();
    }));
  });
});
