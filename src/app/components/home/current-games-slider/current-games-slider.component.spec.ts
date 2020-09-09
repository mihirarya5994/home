import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentGamesSliderComponent } from './current-games-slider.component';

describe('CurrentGamesSliderComponent', () => {
  let component: CurrentGamesSliderComponent;
  let fixture: ComponentFixture<CurrentGamesSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentGamesSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentGamesSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
