import { TpGameComponent } from "./components/tp-game/tp-game.component";
import { forkJoin } from "rxjs";
import { FooterComponent } from "./shared/footer/footer.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";

import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";

import { AppService } from "./core/services/app.service";
import { RestService } from "./core/services/rest.service";

import { AppComponent } from "./app.component";

import { AppRoutes } from "./app.routing";

import { environment } from "./../environments/environment";
import { SplashComponent } from "./components/splash/splash.component";

import { NgxUsefulSwiperModule } from "ngx-useful-swiper";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SwiperModule } from "ngx-swiper-wrapper";
export function loadConfig(appService: AppService, restService: RestService) {
  return () =>
    forkJoin(
      restService.get(environment.configUrl),
      restService.get(environment.contentUrl)
    )
      .toPromise()
      .then(res => {
        appService.setConfig(res[0]);
        appService.setContentConfig(res[1]);
      });
}

@NgModule({
  declarations: [AppComponent, SplashComponent, TpGameComponent],
  imports: [
    BrowserModule,
    CoreModule,
    SwiperModule,
    AppRoutes,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUsefulSwiperModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      multi: true,
      deps: [AppService, RestService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
