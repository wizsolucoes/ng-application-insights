import { Injectable } from '@angular/core';
import {
  ApplicationInsights,
  IExceptionTelemetry,
} from '@microsoft/applicationinsights-web';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class NgApplicationInsightsConfig {
  enabled = true;
  instrumentationKey = '';
}

@Injectable({
  providedIn: 'root',
})
export class NgApplicationInsightsService {
  appInsights: ApplicationInsights;

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
  }

  trackPageView(name?: string, uri?: string): void {
    if (this.config.enabled) {
      this.appInsights.trackPageView({ name, uri });
    }
  }

  trackException(error: Error): void {
    const exception: IExceptionTelemetry = {
      exception: error,
    };
    if (this.config.enabled) {
      this.appInsights.trackException(exception);
    }
  }

  private createRouterSubscription(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.trackPageView(null, event.urlAfterRedirects);
      });
  }
}
