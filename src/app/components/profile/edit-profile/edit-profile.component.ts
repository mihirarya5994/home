import { RestService } from './../../../core/services/rest.service';
import { AppService } from './../../../core/services/app.service';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/core/services/profile.service';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/event-emitter.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profileDetails;
  showXpDetails = false;
  loading = true;
  data: any;
  constructor(
    private profileService: ProfileService,
    private appService: AppService,
    private restService: RestService,
    private router: Router,
    private eventEmitter: EventEmitterService
  ) {}

  ngOnInit() {
    this.restService.get('assets/config/games.json').subscribe((res) => {
      this.data = res;
      if (this.data) {
        this.loading = false;
      }
    });
    this.profileService.getProfile().subscribe((res) => {
      this.profileDetails = res;
      this.setProfileImg();
      this.loading = false;
    });
  }

  setProfileImg() {
    this.profileService.getProfile().subscribe((res) => {
      const profile: any = res;
      // console.log(res);

      if (profile.avatar) {
        this.profileDetails.avatar = this.appService
          .getContentConfig()
          .avatars.filter((a) => a.id === profile.avatar)[0].imgUrl;
      }
    });
  }
  showDetails() {
    this.showXpDetails = !this.showXpDetails;
  }

  editProfile() {
    this.router.navigate(['/profile/settings']);
    this.eventEmitter.emit({ type: 'EDIT_PAGE', data: null });
  }
}
