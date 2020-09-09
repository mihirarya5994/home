import { AppService } from './../../core/services/app.service';
import { Component, OnInit, Input } from '@angular/core';
import { RestService } from 'src/app/core/services/rest.service';
import { EventEmitterService } from 'src/app/core/services/event-emitter.service';

@Component({
  selector: 'app-vertical-list',
  templateUrl: './vertical-list.component.html',
  styleUrls: ['./vertical-list.component.scss']
})
export class VerticalListComponent implements OnInit {
  info;

  @Input() source: any;
  @Input() data: any;
  point;

  constructor(
    private restService: RestService,
    private appService: AppService,
    private eventEmitter: EventEmitterService
  ) {}

  ngOnInit() {}

  like(game) {
    if (game.liked) {
      const url =
        this.appService.getConfigParam('PROFILE_API_HOST') + '/api/users/apps/like/' + game.appId;

      this.restService.delete(url).subscribe((res) => {
        // this.toastr.info('Removed from My Games');
        game.liked = false;
        this.eventEmitter.emit({ type: 'DISLIKE', data: game.appId });
      });
    } else {
      const url =
        this.appService.getConfigParam('PROFILE_API_HOST') + '/api/users/apps/like/' + game.appId;
      this.restService.put(url, {}).subscribe((res) => {
        // this.toastr.info('Added to My Games');
        game.liked = true;
        this.eventEmitter.emit({ type: 'LIKE', data: game.appId });
      });
    }
  }
  // launchGame(banner) {
  //   const info = this.appService.getUserInfo();
  //   if (banner.url) {
  //     location.href = banner.url;
  //   }
  // }

  launchGame(banner) {
    const info = this.appService.getUserInfo();
    if (banner.url) {
      location.href = banner.url + info.jwt;
    }
  }
}
