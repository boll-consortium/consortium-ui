import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideControlComponent } from './aside-control.component';

describe('AsideControlComponent', () => {
  let component: AsideControlComponent;
  let fixture: ComponentFixture<AsideControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsideControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
