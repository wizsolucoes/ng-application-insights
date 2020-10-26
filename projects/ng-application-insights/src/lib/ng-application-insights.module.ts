import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  NgApplicationInsightsConfig,
  NgApplicationInsightsService,
} from './ng-application-insights.service';

@NgModule()
export class NgApplicationInsightsModule {
  constructor(
    public ngApplicationInsightsService: NgApplicationInsightsService
  ) {}

  static forRoot(
    config: NgApplicationInsightsConfig
  ): ModuleWithProviders<NgApplicationInsightsModule> {
    return {
      ngModule: NgApplicationInsightsModule,
      providers: [{ provide: NgApplicationInsightsConfig, useValue: config }],
    };
  }
}
