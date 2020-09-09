import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import { ProfileService } from './profile.service';
import { AppService } from './app.service';
import { Router } from '@angular/router';
declare let digitalData: any;
declare const dataLayer: any;
declare const _satellite: any;
@Injectable({
  providedIn: 'root'
})
export class TrackerService  {
  private appName = '';
  customerId: any;
  campaignData: any;

  constructor(
    private profileService: ProfileService,
    private logger: LoggerService,
    private appService: AppService,
    private router: Router,

  ) { }

getUserData() {
  try {
    this.customerId = this.appService.getUserInfo().info.customerId;
  } catch (e) {
    this.customerId = '';
    this.logger.error('blank customer ID');
  }
  try {
    this.campaignData = this.appService.getAdobeData();
  } catch (e) {
    this.campaignData = '';
    this.logger.error('blank Campaign ID');
  }
}
  initialize(appName) {
    this.appName = appName;
  }

  trackPage(_pageName) {
    this.getUserData();
    try {
      digitalData = {
        page: {
          pageName: _pageName,
          pageInfo: {
            appName: this.appName
          }
        },
        user: {
          bpid: this.customerId
        },
        campaign: this.campaignData

      };
      _satellite.track('pageLoad');
    } catch (e) {
      this.logger.error('Error tracking Link');
    }
  }

  trackLink(_linkName, _linkPosition, _linkType) {
    try {
      digitalData = {
        link: {
          linkName: _linkName,
          linkPosition: _linkPosition,
          linkType: _linkType
        }
      };
      _satellite.track('linkTracking');
    } catch (e) {
      this.logger.error('Error tracking Link');
    }
  }
  trackWithUserInfo(_linkName, _linkPosition, _linkType, plan_id, brand, category, offer) {
    try {
      digitalData = {
        link: {
          linkName: _linkName,
          linkPosition: _linkPosition,
          linkType: _linkType
        },
        coupon: {
          planID: plan_id,
          brand: brand,
          category: category,
          offer: offer
        }
      };
      _satellite.track('copyCoupon');
    } catch (e) {
      this.logger.error('Error tracking Link');
    }
  }
  trackGAPageLoad( pageTitle) {
    let pageData: any = {};
    try {
      pageData = {
        event: 'virtualPageView',
        virtualPageURL: this.router.url,
        virtualPageTitle: pageTitle,
        appName: 'JioEngage home page AWS',
        env: this.appService.getEnvVariable('ENV')
      };
      dataLayer.push(pageData);
    } catch (e) {
      this.logger.error('Error tracking GA Page');
    }
  }

  trackGAClickTrack(action, label) {
    let linkData: any = {};
    try {
      linkData = {
        new_Category: 'JioEngage home page AWS',
        new_Label: label,
        new_Action: action,
        event: 'jioEngageHomePageAws'
      };
      dataLayer.push(linkData);
    } catch (e) {
      this.logger.error('Error tracking Link');
    }
  }
  trackGACoupon(action, label, plan_id, brand, category, offer){
    let linkData: any = {};
    try {
      linkData = {
        new_Category: 'JioEngage home page AWS',
        new_Label: label,
        new_Action: action,
        event: "jioEngageHomePageAws",
        PlanID:plan_id,
        brand:brand,
        Category:category,
        Offer:offer
      };
      dataLayer.push(linkData);
    } catch (e) {
      this.logger.error('Error tracking Link');
    }
  }
  trackGAProfileInfo(action, label, ageGroup,city,gender){
    let linkData: any = {};
    try {
      linkData = {
        new_Category: 'JioEngage home page AWS',
        new_Label: label,
        new_Action: action,
        event: "jioEngageHomePageAws",
        ageGroup:ageGroup,
        city:city,
        gender:gender
      };
      dataLayer.push(linkData);
    } catch (e) {
      this.logger.error('Error tracking Link');
    }
  }
}
