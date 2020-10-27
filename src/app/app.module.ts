import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  NgApplicationInsightsModule,
  NgApplicationInsightsErrorHandler,
} from '@wizsolucoes/ng-application-insights';

@NgModule({
  declarations: [],
  imports: [NgApplicationInsightsModule.forRoot({
      enabled: true,
      instrumentationKey = '',
    })],
  bootstrap: [],
  providers: [{ provide: ErrorHandler, useClass: NgApplicationInsightsErrorHandler }]
})
export class AppModule { }
