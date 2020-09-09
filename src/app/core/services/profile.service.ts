import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';
declare const window: any;
import { AppService } from './app.service';
import { RestService } from './rest.service';
import { EventEmitterService } from './event-emitter.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profile: any = {};

  constructor(
    private appService: AppService,
    private restService: RestService,
    private eventEmitterService: EventEmitterService,
    private logger: LoggerService
  ) {}

  getProfile() {
    return this.restService
      .get(this.appService.getConfigParam('PROFILE_API_HOST') + '/api/users/my_profile')
      .pipe(
        tap((res) => {
          this.profile = res;
        })
      );
  }

  updateProfile(values) {
    return this.restService.put(
      this.appService.getConfigParam('PROFILE_API_HOST') + '/api/users/my_profile',
      values
    );
  }

  getProfileSync() {
    return this.profile;
  }
}
