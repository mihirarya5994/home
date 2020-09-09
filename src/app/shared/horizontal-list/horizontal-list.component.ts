import { ExternalInterfaceService } from './../../core/services/external-interface.service';
import { RestService } from './../../core/services/rest.service';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  NgZone,
  Output,
  EventEmitter
} from '@angular/core';

import * as Flickity from 'flickity';
import { AppService } from 'src/app/core/services/app.service';
import { EventEmitterService, EventData } from 'src/app/core/services/event-emitter.service';
import { TrackerService } from 'src/app/core/services/tracker.service';

@Component({
  selector: 'app-horizontal-list',
  templateUrl: './horizontal-list.component.html',
  styleUrls: ['./horizontal-list.component.scss']
})
export class HorizontalListComponent implements OnInit {
  @Input() source: any;
  @Input() showFavouriteApps = false;
  @Input() likedApps: any[] = [];
  @Input() data;

  @Output() like: EventEmitter<any> = new EventEmitter();
  @Output() dislike: EventEmitter<any> = new EventEmitter();

  engageItems: any[] = [];

  filteredApps: any[] = [];

  @ViewChild('slider') sliderEle: ElementRef;

  slider;
  selectedItem;
  selectedcategory;
  constructor(
    private restService: RestService,
    private appService: AppService,
    private eventEmitter: EventEmitterService,
    private trackerService: TrackerService,
    private externalInterfaceService: ExternalInterfaceService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.getGames();
    setTimeout(() => {
      // this.setupSlider();
    }, 300);

    this.eventEmitter.subscribe((event: EventData) => {
      if (event.type === 'LIKE') {
        this.addToLikedApps(event.data);
      } else if (event.type === 'DISLIKE') {
        this.removeFromLikes(event.data);
      }
    });
  }

  addToLikedApps(appId) {
    this.zone.run(() => {
      this.data.forEach((d) => {
        if (d.appId === appId) {
          d.liked = true;
          this.likedApps.push(d);
          // return;
        }
      });
      // console.log('added > ', this.likedApps);
    });
  }

  removeFromLikes(appId) {
    const url =
      this.appService.getConfigParam('PROFILE_API_HOST') + '/api/users/apps/like/' + appId;
    this.restService.delete(url).subscribe((res) => {
      // console.log('removed');
    });
    this.data.forEach((d) => {
      if (d.appId === appId) {
        const index = this.likedApps.indexOf(d);
        this.likedApps.splice(index, 1);
        d.liked = false;
        return;
      }
    });
  }

  getGames() {
    this.restService.get('assets/config/games.json').subscribe((res: any) => {
      this.engageItems = res.engagements;
      this.selectedItem = '1';
      this. selectedcategory = '1';
      // console.log(this.engageItems[0].atag);
      this.clickItem(1, this.engageItems[0].atag);
      // console.log(this.engageItems);
    });
  }

  // setupSlider() {
  //   this.slider = new Flickity(this.sliderEle.nativeElement, {
  //     prevNextButtons: false,
  //     contain: true,
  //     pageDots: true,
  //     autoPlay: true,
  //     wrapAround: true,
  //     freeScroll: true,
  //     cellAlign: 'center'
  //     // groupCells: false
  //   });

  //   this.slider.on('select', (index) => {
  //     this.slider.playPlayer();
  //   });

  //   this.slider.on('pointerUp', (index) => {
  //     this.slider.playPlayer();
  //   });
  //   this.slider.on('pointerDown', (index) => {
  //     this.slider.playPlayer();
  //   });
  //   this.slider.on('pointerMove', (index) => {
  //     this.slider.playPlayer();
  //   });
  // }

  launchGame(banner) {
    // console.log(this.selectedcategory);
    // this.trackerService.trackLink(banner.linkName, '', this.selectedcategory);
    this.trackerService.trackGAClickTrack(this.selectedcategory,banner.linkName);
    const info = this.appService.getUserInfo();
    if (banner.type === 'screenz') {
      this.externalInterfaceService.openScreenZ({
        uid: info.uid,
        pid: banner.pid,
        pageid: banner.pageid
      })
    }
    else if (banner.url) {
      location.href = banner.url + info.jwt;
    } else if (banner.boturl) {
      location.href = banner.boturl;
    }
  }

  likeApp(game) {
    if (game.liked) {
      this.dislike.emit(game);
    } else {
      this.like.emit(game);
    }
  }

  clickItem(currentID, arg) {
    // console.log(arg);
    // this.trackerService.trackLink(arg, '', 'Category Selection');
    this.filteredApps = [];
    this.selectedItem = currentID;
    this. selectedcategory = arg;
    // console.log(this.selectedcategory);
    this.data.filter((item) => {
      if (item && item.engagements && item.engagements.indexOf(parseInt(currentID)) >= 0) {
        this.filteredApps.push(item);
      }
    });
    if (this.filteredApps.length) {
      if (this.slider) {
        this.slider.destroy();
      }
      setTimeout(() => {
        // this.setupSlider();
      }, 50);
    }
  }
}
