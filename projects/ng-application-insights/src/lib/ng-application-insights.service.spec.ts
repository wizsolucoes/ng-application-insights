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

    it('should call trackEvent with event', () => {
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

    it('should call trackPageViewPerfomance with custom properties', () => {
      // Given
      spyOn(service.appInsights, 'trackPageViewPerformance');

      service.setCustomProperties({
        'SomeProperty': 'some-value',
      });

      // When
      service.trackPageViewPerformance(
        'testPageViewPerformance',
        'example.uri'
      )

      // Then
      expect(service.appInsights.trackPageViewPerformance).toHaveBeenCalledWith({
        name: 'testPageViewPerformance',
        uri: 'example.uri',
        properties: {
          'SomeProperty': 'some-value',
        },
      });
    });

    it('should call trackTrace with a trace message', () => {
      // Given
      spyOn(service.appInsights, 'trackTrace');

      // When
      service.trackTrace('some-trace-message');

      // Then
      expect(service.appInsights.trackTrace).toHaveBeenCalledWith({
        message: 'some-trace-message',
        properties: {},
      });
    });

    it('should call trackMetric with an average', () => {
      // Given
      spyOn(service.appInsights, 'trackMetric');

      // When
      service.trackMetric('some-name', 1);

      // Then
      expect(service.appInsights.trackMetric).toHaveBeenCalledWith({
        name: 'some-name',
        average: 1,
        properties: {}
      });
    });

    it('should call trackDependencyData with an ID and a Response Code', () => {
      // Given
      spyOn(service.appInsights, 'trackDependencyData');

      // When
      service.trackDependencyData('some-name', 'some-id', 1);

      // Then
      expect(service.appInsights.trackDependencyData).toHaveBeenCalledWith({
        id: 'some-id',
        responseCode: 1,
        name: 'some-name',
        properties: {}
      });
    });

    it('should call startTrackPage with page name', () => {
      // Given
      spyOn(service.appInsights, 'startTrackPage');

      // When
      service.startTrackPage('page-name');

      // Then
      expect(service.appInsights.startTrackPage).toHaveBeenCalledWith(
        'page-name'
      );
    });

    it('should call stopTrackPage with page name and URL', () => {
      // Given
      spyOn(service.appInsights, 'stopTrackPage');

      // When
      service.stopTrackPage('page-name', 'example.url');

      // Then
      expect(service.appInsights.stopTrackPage).toHaveBeenCalledWith(
        'page-name',
        'example.url',
        {}
      );
    });

    it('should call startTrackEvent with event name', () => {
      // Given
      spyOn(service.appInsights, 'startTrackEvent');

      // When
      service.startTrackEvent('event-name');

      // Then
      expect(service.appInsights.startTrackEvent).toHaveBeenCalledWith(
        'event-name'
      );
    });

    it('should call stopTrackEvent with event name and measurements', () => {
      // Given
      spyOn(service.appInsights, 'stopTrackEvent');

      // When
      service.stopTrackEvent('event-name', { 'some-measurement': 1 });

      // Then
      expect(service.appInsights.stopTrackEvent).toHaveBeenCalledWith(
        'event-name',
        {},
        { 'some-measurement': 1 }
      );
    });
  });

  describe('service is disabled', () => {
    const mockAICOnfig = new NgApplicationInsightsConfig();
    mockAICOnfig.enabled = false;
    mockAICOnfig.instrumentationKey = '';
    mockAICOnfig.properties = {};

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

    it('should NOT call trackPageViewPerfomance', () => {
      // Given
      service.setCustomProperties({
        'SomeProperty': 'some-value',
      });

      // When
      service.trackPageViewPerformance(
        'testPageViewPerformance',
        'example.uri'
      )

      // Then
      expect(service.appInsights).not.toBeTruthy();
    });

    it('should NOT call trackTrace', () => {
      // When
      service.trackTrace('some-trace-message');

      // Then
      expect(service.appInsights).not.toBeTruthy();
    });

    it('should NOT call trackMetric', () => {
      // When
      service.trackMetric('some-name', Math.random());

      // Then
      expect(service.appInsights).not.toBeTruthy();
    });

    it('should NOT call trackDependencyData', () => {
      // When
      service.trackDependencyData('some-name', 'some-id', Math.random());

      // Then
      expect(service.appInsights).not.toBeTruthy();
    });

    it('should NOT call startTrackPage', () => {
      // When
      service.startTrackPage('page-name');

      // Then
      expect(service.appInsights).not.toBeTruthy();
    });

    it('should NOT call stopTrackPage', () => {
      // When
      service.stopTrackPage('page-name', 'example.url');

      // Then
      expect(service.appInsights).not.toBeTruthy();
    });

    it('should NOT call startTrackEvent', () => {
      // When
      service.startTrackEvent('event-name');

      // Then
      expect(service.appInsights).not.toBeTruthy();
    });

    it('should NOT call stopTrackEvent', () => {
      // When
      service.stopTrackEvent('event-name', { 'some-measurement': 1 });

      // Then
      expect(service.appInsights).not.toBeTruthy();
    });
  });
});
