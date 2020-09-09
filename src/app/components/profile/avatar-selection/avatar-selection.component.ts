import { AppService } from 'src/app/core/services/app.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-avatar-selection',
  templateUrl: './avatar-selection.component.html',
  styleUrls: ['./avatar-selection.component.scss']
})
export class AvatarSelectionComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();

  avatars = [];
  profile;

  constructor(private appService: AppService, private profileService: ProfileService) {}

  ngOnInit() {
    this.profile = this.profileService.getProfile();
    this.avatars = this.appService.getContentConfig().avatars;
  }

  selectAvatar(avatar) {
    this.profileService.updateProfile({ avatar: avatar.id }).subscribe(() => this.closePopup());
  }

  closePopup() {
    this.close.emit();
  }
}
