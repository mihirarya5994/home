import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunGamesComponent } from './fun-games.component';

describe('FunGamesComponent', () => {
  let component: FunGamesComponent;
  let fixture: ComponentFixture<FunGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunGamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
