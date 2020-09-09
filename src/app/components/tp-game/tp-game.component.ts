import { element } from "protractor";
import { AppService } from "./../../core/services/app.service";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "app-tp-game",
  templateUrl: "./tp-game.component.html",
  styleUrls: ["./tp-game.component.scss"]
})
export class TpGameComponent implements OnInit {
  @ViewChild("gameFrame") gameFrame: ElementRef;
  gamesConfig = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      params =>
        (this.gameFrame.nativeElement.src = this.appService
          .getContentConfig()
          .thirdPartyGames.filter(
            game => game.id === params.get("gameName")
          )[0].assetPath)
    );
  }
}
