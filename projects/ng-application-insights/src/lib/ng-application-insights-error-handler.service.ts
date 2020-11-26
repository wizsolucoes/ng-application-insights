import { Injectable, ErrorHandler } from '@angular/core';
import {
  NgApplicationInsightsConfig,
  NgApplicationInsightsService,
} from './ng-application-insights.service';

@Injectable({
  providedIn: 'root',
})
export class NgApplicationInsightsErrorHandler extends ErrorHandler {
  constructor(
    private config: NgApplicationInsightsConfig,
    private ngApplicationInsightsService: NgApplicationInsightsService
  ) {
    super();
  }

  handleError(error: Error): void {
    if (!this.config.enabled) {
      console.error(error);
      return;
    }

    this.ngApplicationInsightsService.trackException(error);
  }

  setTenantIdForApplication(tenantId: string): void {
    this.ngApplicationInsightsService.setTenantId(tenantId);
  }
}
