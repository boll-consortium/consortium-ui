import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningProvidersComponent } from './learning-providers.component';

describe('LearningProvidersComponent', () => {
  let component: LearningProvidersComponent;
  let fixture: ComponentFixture<LearningProvidersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearningProvidersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
