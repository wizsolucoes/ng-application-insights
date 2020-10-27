import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  NgApplicationInsightsModule,
  NgApplicationInsightsErrorHandler,
} from '@wizsolucoes/ng-application-insights';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    NgApplicationInsightsModule.forRoot({
      enabled: environment.production,
      instrumentationKey = environment.appInsights.instrumentationKey,
    }),
  ],
  providers: [{ provide: ErrorHandler, useClass: NgApplicationInsightsErrorHandler }],
  bootstrap: []
})
export class AppModule { }
