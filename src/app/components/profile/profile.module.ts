import { AvatarSelectionComponent } from './avatar-selection/avatar-selection.component';
import { ProfileComponent } from './profile.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile.routing';
import { CaptureProfileComponent } from './capture-profile/capture-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    CaptureProfileComponent,
    EditProfileComponent,
    ProfileComponent,
    SettingsComponent,
    AvatarSelectionComponent
  ],
  imports: [CommonModule, ProfileRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class ProfileModule {}
