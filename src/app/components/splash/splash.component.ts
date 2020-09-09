import { ExternalInterfaceService } from './../../core/services/external-interface.service';
import { ProfileService } from './../../core/services/profile.service';
import { AppService } from './../../core/services/app.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Router } from '@angular/router';

import Swiper, { SwiperOptions } from 'swiper';
import { RestService } from 'src/app/core/services/rest.service';
import { Profile } from 'selenium-webdriver/firefox';

import * as Flickity from 'flickity';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {
  @ViewChild('slider') sliderEle: ElementRef;
  // @ViewChild('pagination') sliderPagination: ElementRef;
  // @ViewChild('next') sliderNext: ElementRef;
  // @ViewChild('prev') sliderPrev: ElementRef;

  slider;

  constructor(
    private router: Router,
    private profile: ProfileService,
    private appService: AppService,
    private restService: RestService,
    private externalInterface: ExternalInterfaceService
  ) {}

  ngOnInit() {
    this.router.navigate(['/dashboard']);
  }

  setupSlider() {
    this.slider = new Flickity(this.sliderEle.nativeElement, {
      prevNextButtons: false,
      contain: true,
      pageDots: true,
      autoplay: true,
      wrapAround: true,
      freeScroll: true,
      cellAlign: 0,
      groupCells: false
    });
    this.slider.on('select', (index) => {
      this.slider.playPlayer();
    });
    this.slider.on('select', (index) => {
      this.slider.playPlayer();
    });
  }

  navigateToTnc() {
    this.externalInterface.launchBrowser(this.appService.getConfigParam('TNC_URL'));
  }

  getStarted() {
    this.profile.getProfile().subscribe((res) => {
      // console.log(res);
      if (!res.nickName) {
        this.router.navigate(['/profile']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
