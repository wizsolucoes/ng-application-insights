import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgApplicationInsightsComponent } from './ng-application-insights.component';

describe('NgApplicationInsightsComponent', () => {
  let component: NgApplicationInsightsComponent;
  let fixture: ComponentFixture<NgApplicationInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgApplicationInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgApplicationInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
