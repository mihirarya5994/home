import { CurrentGamesSliderComponent } from './current-games-slider/current-games-slider.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutes } from './home.routing';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';

const components = [HomeComponent];

@NgModule({
  declarations: [HomeComponent, CurrentGamesSliderComponent],
  imports: [CommonModule, HomeRoutes, SharedModule]
})
export class HomeModule {}
