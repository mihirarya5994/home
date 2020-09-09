/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TpGameComponent } from './tp-game.component';

describe('TpGameComponent', () => {
  let component: TpGameComponent;
  let fixture: ComponentFixture<TpGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
