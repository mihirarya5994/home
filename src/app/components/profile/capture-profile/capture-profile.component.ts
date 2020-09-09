import { GENDERS, AGE_GROUPS, STATE_LIST } from './../../../app.constants';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/core/services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-capture-profile',
  templateUrl: './capture-profile.component.html',
  styleUrls: ['./capture-profile.component.scss']
})
export class CaptureProfileComponent implements OnInit {
  ageGroups = AGE_GROUPS;
  genders = GENDERS;
  states = STATE_LIST;
  profileForm: FormGroup;
  submitted = false;
  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      nickName: [
        '',
        [Validators.required, Validators.maxLength(8), Validators.pattern(/^[a-zA-Z]+$/)]
      ],
      ageGroup: ['', Validators.required],
      gender: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  submitProfile() {
    this.submitted = true;
    if (this.profileForm.valid) {
      this.profileService
        .updateProfile({
          nickName: this.profileForm.controls.nickName.value,
          ageGroup: this.profileForm.controls.ageGroup.value,
          gender: this.profileForm.controls.gender.value,
          state: this.profileForm.controls.state.value
        })
        .subscribe((res) => {
          this.router.navigate(['/dashboard']);
        });
    }
  }
}
