import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningRecordsComponent } from './learning-records.component';

describe('LearningRecordsComponent', () => {
  let component: LearningRecordsComponent;
  let fixture: ComponentFixture<LearningRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearningRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
