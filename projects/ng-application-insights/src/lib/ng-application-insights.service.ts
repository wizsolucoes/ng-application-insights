import { Injectable } from '@angular/core';
import {
  ApplicationInsights,
  IConfig,
  IConfiguration,
  IEventTelemetry,
  IExceptionTelemetry,
  ITelemetryItem,
  
} from '@microsoft/applicationinsights-web';
import { Router } from '@angular/router';

interface ICustomProperties {
  [key: string]: any;
}

@Injectable()
export class NgApplicationInsightsConfig {
  enabled = true;
  instrumentationKey = '';
  properties?: ICustomProperties = {};
  extraConfig?: IConfiguration & IConfig = {};
  disabledUrls?: string[] = [];
};

@Injectable({
  providedIn: 'root',
})
export class NgApplicationInsightsService {
  public appInsights!: ApplicationInsights;
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
          ...this.config.extraConfig,
        },
      });

       this.appInsights.addTelemetryInitializer((envelope: ITelemetryItem) => {
         const dataBase = JSON.stringify(envelope.baseData);
          const disabled = this.config.disabledUrls || [];
         if ( disabled.some((item) => dataBase.includes(item))) {
            return false;
          }
          return true;
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
