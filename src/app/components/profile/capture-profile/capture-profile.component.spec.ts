import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureProfileComponent } from './capture-profile.component';

describe('CaptureProfileComponent', () => {
  let component: CaptureProfileComponent;
  let fixture: ComponentFixture<CaptureProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptureProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
