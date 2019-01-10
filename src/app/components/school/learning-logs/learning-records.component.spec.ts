import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LearningLogsComponent} from './learning-records.component';

describe('LearningLogsComponent', () => {
  let component: LearningLogsComponent;
  let fixture: ComponentFixture<LearningLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LearningLogsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
