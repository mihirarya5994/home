import { LoaderComponent } from './loader/loader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { FooterComponent } from './footer/footer.component';
import { HorizontalListComponent } from './horizontal-list/horizontal-list.component';
import { VerticalListComponent } from './vertical-list/vertical-list.component';
import { FunGamesComponent } from './fun-games/fun-games.component';

@NgModule({
  declarations: [
    FooterComponent,
    HorizontalListComponent,
    VerticalListComponent,
    LoaderComponent,
    FunGamesComponent
  ],
  imports: [CommonModule, NgxUsefulSwiperModule],
  exports: [
    FooterComponent,
    HorizontalListComponent,
    VerticalListComponent,
    LoaderComponent,
    FunGamesComponent
  ]
})
export class SharedModule {}
