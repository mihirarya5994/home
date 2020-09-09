import { ExternalInterfaceService } from "./../../../core/services/external-interface.service";
import { AppService } from "./../../../core/services/app.service";
import { RestService } from "src/app/core/services/rest.service";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input
} from "@angular/core";

import * as Flickity from "flickity";
import { TrackerService } from "src/app/core/services/tracker.service";
import { CountdownService } from "src/app/core/services/countdown.service";
import { Subscription } from "rxjs";
@Component({
  selector: "app-current-games-slider",
  templateUrl: "./current-games-slider.component.html",
  styleUrls: ["./current-games-slider.component.scss"]
})
export class CurrentGamesSliderComponent implements OnInit, AfterViewInit {
  @ViewChild("slider") sliderEle: ElementRef;

  @Input() data;
  loading = true;
  topSlides = [];
  slider;
  uid: any;
  countdownSubscription: Subscription;
  displayTime = { hours: 0, minutes: 0, seconds: 0 };

  constructor(
    private restService: RestService,
    private trackerService: TrackerService,
    private exteranalInterfaceService: ExternalInterfaceService,
    private countdownService: CountdownService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.loading = true;
    if (this.data) {
      setTimeout(() => {
        this.initSlider();
        this.loading = false;
      }, 500);
    }
  }

  ngAfterViewInit() {
    const arg = new Date("2019-10-15T14:30:32.733Z");
    this.uid = this.appService.getUserInfo().uid;
    this.countdownService.startCountdown(arg);
    this.countdownSubscription = this.countdownService.countdown$.subscribe(
      res => {
        // console.log(res);

        // this.displayTime.hours = res.hours;
        this.displayTime.minutes = res.minutes;
        this.displayTime.seconds = res.seconds;
        this.displayTime.hours = res.hours;
        if (res.days) {
          this.displayTime.hours = res.days * 24 + res.hours;
        }
      }
    );
  }

  initSlider() {
    this.slider = new Flickity(this.sliderEle.nativeElement, {
      prevNextButtons: false,
      autoPlay: true,
      contain: false,
      pageDots: true,
      wrapAround: true
    });

    this.slider.on("select", index => {
      this.slider.playPlayer();
    });
    this.slider.on("pointerDown", index => {
      this.slider.playPlayer();
    });
    this.slider.on("pointerUp", index => {
      this.slider.playPlayer();
    });
    this.slider.on("pointerMove", index => {
      this.slider.playPlayer();
    });
  }
  OpenScreenz(banner) {
    this.exteranalInterfaceService.openScreenZ({
      uid: this.uid,
      pid: banner.pid,
      pageid: banner.pageid
    });
  }

  launch(banner) {
    const info = this.appService.getUserInfo();
    if (banner.url) {
      location.href = banner.url + info.jwt;
    }
  }

  clickGame(banner) {
    // this.trackerService.trackLink(banner.linkName, banner.id, "Carousal");
    this.trackerService.trackGAClickTrack("Top Banner",banner.linkName)
    if (banner.type === "screenz") {
      this.OpenScreenz(banner);
    } else {
      this.launch(banner);
    }
  }
}
