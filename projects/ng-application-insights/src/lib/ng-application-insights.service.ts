import { Injectable } from '@angular/core';
import {
  ApplicationInsights,
  IEventTelemetry,
  IExceptionTelemetry,
} from '@microsoft/applicationinsights-web';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface ICustomProperties {
  [key: string]: any;
}

@Injectable()
export class NgApplicationInsightsConfig {
  enabled = true;
  instrumentationKey = '';
  properties?: ICustomProperties = {};
}

@Injectable({
  providedIn: 'root',
})
export class NgApplicationInsightsService {
  appInsights: ApplicationInsights;
  private customProperties: ICustomProperties = {};

  constructor(
    private config: NgApplicationInsightsConfig,
    private router: Router
  ) {
    if (this.config.enabled) {
      this.appInsights = new ApplicationInsights({
        config: {
          instrumentationKey: this.config.instrumentationKey,
          enableAutoRouteTracking: true,
        },
      });

      this.appInsights.loadAppInsights();
      this.createRouterSubscription();
    }

    this.customProperties = {
      ...this.customProperties,
      ...config.properties,
    };
  }

  trackPageView(name?: string, uri?: string): void {
    if (this.config.enabled) {
      this.appInsights.trackPageView({
        name,
        uri,
        properties: this.customProperties,
      });
    }
  }

  trackEvent(
    event: IEventTelemetry,
    customProperties?: { [key: string]: any }
  ): void {
    if (this.config.enabled) {
      customProperties = {
        ...customProperties,
        ...this.customProperties,
      }
      this.appInsights.trackEvent(event, customProperties);
    }
  }

  trackException(error: Error): void {
    const exception: IExceptionTelemetry = {
      exception: error,
      properties: this.customProperties,
    };
    if (this.config.enabled) {
      this.appInsights.trackException(exception);
    }
  }

  trackPageViewPerformance(name?: string, uri?: string): void {
    if (this.config.enabled) {
      this.appInsights.trackPageViewPerformance({
        name,
        uri,
        properties: this.customProperties
      });
    }
  }

  trackTrace(message?: string): void {
    if (this.config.enabled) {
      this.appInsights.trackTrace({
        message,
        properties: this.customProperties
      });
    }
  }

  trackMetric(name?: string, average?: number): void {
    if (this.config.enabled) {
      this.appInsights.trackMetric({
        name,
        average,
        properties: this.customProperties
      });
    }
  }

  trackDependencyData(name?: string, id?: string, responseCode?: number): void {
    if (this.config.enabled) {
      this.appInsights.trackDependencyData({
        id,
        responseCode,
        name,
        properties: this.customProperties
      });
    }
  }

  startTrackPage(pageName?: string): void {
    if (this.config.enabled) {
      this.appInsights.startTrackPage(pageName);
    }
  }

  stopTrackPage(pageName?: string, url?: string): void {
    if (this.config.enabled) {
      this.appInsights.stopTrackPage(pageName, url, this.customProperties);
    }
  }

  startTrackEvent(name?: string): void {
    if (this.config.enabled) {
      this.appInsights.startTrackEvent(name);
    }
  }

  stopTrackEvent(name?: string, measurements?: any): void {
    if (this.config.enabled) {
      this.appInsights.stopTrackEvent(
        name,
        this.customProperties,
        measurements
      );
    }
  }

  flush(): void {
    if (this.config.enabled) {
      this.appInsights.flush();
    }
  }

  setCustomProperties(properties: ICustomProperties): void {
    this.customProperties = {
      ...this.customProperties,
      ...properties
    };
  }

  private createRouterSubscription(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.trackPageView(null, event.urlAfterRedirects);
      });
  }
}
