import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLoggerComponent } from './activity-logger.component';

describe('ActivityLoggerComponent', () => {
  let component: ActivityLoggerComponent;
  let fixture: ComponentFixture<ActivityLoggerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityLoggerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLoggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
