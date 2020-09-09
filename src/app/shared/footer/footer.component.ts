import { AppService } from './../../core/services/app.service';
import { RestService } from 'src/app/core/services/rest.service';
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { EventEmitterService, EventData } from 'src/app/core/services/event-emitter.service';
import { TrackerService } from 'src/app/core/services/tracker.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  userInfo;
  device;
  navList: any[] = [
    {
      title: '',
      route: '/dashboard',
      imgUrl: 'home_inactive.svg',
      activeImgUrl: 'home_active.svg',
      name: 'Home'
    },

    // {
    //   title: '',
    //   route: '/achievements',
    //   imgUrl: 'achievement_icn.png',
    //   activeImgUrl: 'achievement_icn_select.png',
    //   name: 'Achievements',
    //   couponsCount: true
    // },
    {
      title: '',
      route: '/prizes',
      imgUrl: 'prizes_inactive.svg',
      activeImgUrl: 'prizes_active.svg',
      name: 'Winnings'
    },
    // {
    //   title: '',
    //   route: '/ipl/teams',
    //   imgUrl: 'team_icn.png',
    //   activeImgUrl: 'team_icn_select.png',
    //   translationKey: 'MY_TEAMS'
    // },
    {
      title: '',
      route: '/profile/settings',
      imgUrl: 'settings_inactive.svg',
      activeImgUrl: 'settings_active.svg',
      name: 'Settings'
    }
  ];
  activeItem;
  couponsCount = 0;

  constructor(
    private router: Router,

    private restService: RestService,
    private appService: AppService,
    private eventEmitter: EventEmitterService,
    private trackerService: TrackerService,
  ) { }

  ngOnInit() {
    this.activeItem = this.navList[0];

    this.userInfo = this.appService.getUserInfo();
    console.log(this.userInfo.header);
    this.device = this.appService.getOS();
    console.log('device', this.device);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // if (event.url === '/profile/settings') {
        //   this.activeItem = this.navList[1];
        // } else {
        const activatedLink = this.navList.filter((l) => l.route === event.url);
        this.activeItem = activatedLink.length ? activatedLink[0] : null;
        // }
      });
  }

  navigate(nav) {
    // this.trackerService.trackLink(nav.name, 'Homepage Footer', 'Home page button');
    this.trackerService.trackGAClickTrack("Footer Menu",nav.name);
    this.router.navigate([nav.route]);
  }
}
