import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class AppService {
  private config: any = {};
  private userInfo: any = {};
  private contentConfig: any = {};
  timeOffset = 0;
  userProfile = {};
  marketingData: any;

  setUserInfo(info) {
    this.userInfo = info;
    localStorage['userInfo'] = JSON.stringify(info);
  }
  getEnvVariable(param) {
    return environment[param];
  }
  getUserInfo() {
    const userInfo = localStorage['userInfo'];
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return this.userInfo;
  }

  setConfig(config) {
    this.config = config;
  }
  getAdobeData() {
    this.marketingData = localStorage["digitalData"];
    if (this.marketingData) {
      return JSON.parse(this.marketingData);
    }
  }

  getConfigParam(param) {
    return this.config[param];
  }

  getOS() {
    // console.log('checkos');
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/android/i.test(userAgent)) {
      console.log('android');
      return 'android';
    }
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      // console.log('ios');
      return 'ios';
    }
    return 'others';
  }

  // getOS() {
  //   if (navigator.userAgent.match(/Android/i)) {
  //     console.log('android');
  //     return 'android';
  //   }
  //   if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
  //     console.log('ios'); 
  //     return 'ios';
  //   }
  //   return 'others';
  // }

  setUserProfile(profile) {
    Object.assign(this.userProfile, profile);
  }

  getUserProfile() {
    return this.userProfile;
  }

  setCurrentTimeOffset(offset) {
    this.timeOffset = offset;
  }

  setContentConfig(data) {
    this.contentConfig = data;
  }

  getContentConfig() {
    return this.contentConfig;
  }

  getCurrentTimeOffset() {
    return this.timeOffset;
  }

  logout() {
    this.setUserInfo({});
  }
}
