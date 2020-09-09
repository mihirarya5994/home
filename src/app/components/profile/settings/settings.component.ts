import { ExternalInterfaceService } from './../../../core/services/external-interface.service';
import { AppService } from './../../../core/services/app.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { AGE_GROUPS, GENDERS, STATE_LIST } from './../../../app.constants';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/event-emitter.service';
import { TrackerService } from 'src/app/core/services/tracker.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  ageGroups = AGE_GROUPS;
  genders = GENDERS;
  states = STATE_LIST;
  profileForm: FormGroup;
  submitted = false;
  showAvatarSelectionPopup = false;

  avatar;

  profileDetails = {
    sound: false,
    avatar: '',
    ageGroup: '',
    gender: '',
    language: '',
    nickName: '',
    profileImageSet: false,
    profilePending: false,
    state: ''
  };

  inputField = false;
  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router,
    private appService: AppService,
    private eventEmitterService: EventEmitterService,
    private externalInterfaceService: ExternalInterfaceService,
    private trackerService: TrackerService
  ) {}

  ngOnInit() {
    // this.trackerService.trackPage('JioEngage Setting Page');
    this.trackerService.trackGAPageLoad("JioEngage |Setting page")

    this.profileForm = this.fb.group({
      nickName: [
        '',
        [Validators.maxLength(8), Validators.pattern(/^[a-zA-Z]+$/), Validators.minLength(2)]
      ],
      ageGroup: ['', Validators.required],
      gender: ['', Validators.required],
      state: ['', Validators.required],
      sound: [true]
    });

    this.getProfile();
  }

  getProfile() {
    this.profileService.getProfile().subscribe((res) => {
      this.profileDetails = res;
      this.profileForm.get('nickName').setValue(this.profileDetails.nickName);
      this.profileForm.get('ageGroup').setValue(this.profileDetails.ageGroup);
      this.profileForm.get('gender').setValue(this.profileDetails.gender);
      this.profileForm.get('state').setValue(this.profileDetails.state);
    });
    this.setProfileImg();
  }

  showInpuField() {
    this.inputField = true;
  }

  toggleSound() {
    this.profileForm.get('sound').setValue(this.profileDetails.sound);
    this.profileService.updateProfile({ sound: this.profileDetails.sound });
  }

  setProfileImg() {
    this.profileService.getProfile().subscribe((res) => {
      if (res.avatar) {
        this.avatar = this.appService
          .getContentConfig()
          .avatars.filter((a) => a.id === res.avatar)[0].imgUrl;
      }
    });
  }

  toggleAvatarSelectionPopup() {
    this.showAvatarSelectionPopup = !this.showAvatarSelectionPopup;
    this.setProfileImg();

    this.eventEmitterService.emit({ type: 'PROFILE_UPDATE', data: null });
  }
  submitProfile() {
    this.submitted = true;
    if (this.profileForm.valid) {
      this.trackerService.trackGAProfileInfo(
        "Save",
        "JioEngage | Setting page",
        this.profileForm.controls.ageGroup.value,
        this.profileForm.controls.state.value,
        this.profileForm.controls.gender.value
        )

      this.profileService
        .updateProfile({
          nickName: this.profileForm.controls.nickName.value,
          ageGroup: this.profileForm.controls.ageGroup.value,
          gender: this.profileForm.controls.gender.value,
          state: this.profileForm.controls.state.value,
          sound: this.profileForm.controls.sound.value
        })
        .subscribe((res) => {
          this.getProfile();
          this.router.navigate(['/dashboard']);
        });
      return this.getProfile();
    }
  }

  save() {
    // this.trackerService.trackLink('HomePage Save', 'Middle', 'Home page save button');
  }

  launchUrl(type) {
    switch (type) {
      case 'how-to-play':
        this.externalInterfaceService.launchBrowser(
          this.appService.getConfigParam('HOW_TO_PLAY_URL')
        );
        break;
      case 'faq':
        this.externalInterfaceService.launchBrowser(this.appService.getConfigParam('FAQ_URL'));
        break;
      case 'tnc':
        this.externalInterfaceService.launchBrowser(this.appService.getConfigParam('TNC_URL'));
        break;
      case 'invite':
        this.externalInterfaceService.share(this.appService.getConfigParam('SHARE_MESSAGE'));

        break;
    }
  }
}
