import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable, of, forkJoin } from 'rxjs';

import { AppService } from '../services/app.service';
import { RestService } from './../services/rest.service';
import { LoggerService } from './../services/logger.service';
import { ExternalInterfaceService } from './../services/external-interface.service';
import { UtilService } from './../services/util.service';
import { ProfileService } from '../services/profile.service';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  private isLoggedIn = false;
  private host = null;
  private isHeaderPresent;
  digitalData;
  constructor(
    private router: Router,
    private appService: AppService,
    private restService: RestService,
    private logger: LoggerService,
    private externalInterfaceService: ExternalInterfaceService,
    private profile: ProfileService,
    private util: UtilService
  ) {
           // Atags
           this.digitalData = {
            utmSource: this.getParameterByName('utm_source'),
            utmMedium: this.getParameterByName('utm_medium'),
            utmCampaign: this.getParameterByName('utm_campaign'),
            utmContent: this.getParameterByName('utm_content'),
            utmTerm: this.getParameterByName('utm_term')
          };
          localStorage.setItem('digitalData', JSON.stringify(this.digitalData));
          // console.log('UTM tags -', this.digitalData);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isLoggedIn) {
      return true;
    }
    const jwtFromRoute = this.util.getParameterByName('jwt');
    const userInfo = this.appService.getUserInfo();
    this.host = this.util.getParameterByName('host');
    this.isHeaderPresent = this.util.getParameterByName('header');
    if (jwtFromRoute && jwtFromRoute !== 'null') {
      return this.validateJWT(jwtFromRoute);
    } else if (userInfo.jwt) {
      return this.validateJWT(userInfo.jwt);
    }
    this.externalInterfaceService.requestJWT();
    this.logger.log('requesting jwt from native');
    return false;
  }

  public validateJWT(jwt) {
    if (this.isLoggedIn) {
      return true;
    }

    const parsed = this.parseJWT(jwt);
    const userInfo = this.appService.getUserInfo();
    userInfo['jwt'] = jwt || userInfo['jwt'];
    userInfo['host'] = this.host || userInfo['host'];

    userInfo['header'] = this.isHeaderPresent || userInfo['header'];
    userInfo['parsed'] = parsed || userInfo['parsed'];
    this.appService.setUserInfo(userInfo);
    // return true;
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', jwt);

    this.restService
      .post(this.appService.getConfigParam('PROFILE_API_HOST') + '/api/login', null, {
        headers: headers
      })
      .pipe(
        catchError(() => {
          return of(false);
        })
      )

      .subscribe(
        (results: any) => {
          this.isLoggedIn = true;
          this.appService.setUserInfo({
            jwt: results.jwt,
            info: userInfo['parsed'],
            host: userInfo['host'],
            uid: results.uuid,
            header: userInfo['header']
          });
          if (results.nickName) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['']);
            return true;
          }
        },
        (err) => {
          this.isLoggedIn = false;
          this.externalInterfaceService.requestJWT();
          return false;
        }
      );
  }

  public getParameterByName(name, url?) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  public parseJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
}
