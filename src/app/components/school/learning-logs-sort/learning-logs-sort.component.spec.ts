import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningLogsSortComponent } from './learning-logs-sort.component';

describe('LearningLogsSortComponent', () => {
  let component: LearningLogsSortComponent;
  let fixture: ComponentFixture<LearningLogsSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearningLogsSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningLogsSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
