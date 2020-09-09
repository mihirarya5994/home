import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TrackerService } from "src/app/core/services/tracker.service";

// import * as Flickity from 'flickity';
// import { ToastrService } from 'ngx-toastr';
// import { ClipboardService } from 'ngx-clipboard';
// import { forkJoin } from 'rxjs';

import { AppService } from "../../core/services/app.service";
import { RestService } from "../../core/services/rest.service";
import { ExternalInterfaceService } from "./../../core/services/external-interface.service";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ClipboardService } from "ngx-clipboard";
import { toArray } from "rxjs/operators";
// import { DatePipe } from '@angular/common';

@Component({
  selector: "app-prizes",
  templateUrl: "./prizes.component.html",
  styleUrls: ["./prizes.component.scss"]
  // providers: [DatePipe]
})
export class PrizesComponent implements OnInit {
  [x: string]: any;
  FilterForm: FormGroup;

  activeBrand;
  tabs = [{ id: 1, title: "My Winnings", active: false }];
  // myDate = new Date();
  prizes: any[] = [];

  activeTab = this.tabs[0];
  prizeList: any = {};
  winnings: any = {};
  currentWinnings: any = {};

  showCopyMessage = false;
  loading = true;
  showContents = false;
  showBrands = false;
  showEngagements = false;
  totalCoupons = 0;
  showCategories = false;

  engagements = null;
  brands = null;
  categories = null;
  filters: any;
  count: any;
  CouponExpired = false;
  all = true;
  showAll = true;

  constructor(
    private appService: AppService,
    private restService: RestService,
    private externalInterfaceService: ExternalInterfaceService,
    private activatedRoute: ActivatedRoute,
    private clip: ClipboardService,
    private fb: FormBuilder,
    private trackerService: TrackerService // private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.FilterForm = this.fb.group({
      selected: ["All", [Validators.required]]
    });
    // this.trackerService.trackPage("JioEngage Winnings Page");
    this.trackerService.trackGAPageLoad("JioEngage |MyWinning page")

    this.FilterForm.valueChanges.subscribe(res => {});
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.type === "winnings") {
        this.setTab(this.tabs[1]);
      }
    });
    this.fetchMyWinnings();
  }

  fetchMyWinnings() {
    this.restService
      .get(
        this.appService.getConfigParam("COUPON_API_HOST") +
          "/winnerDetails?programName=all"
      )
      .subscribe(res => {
        this.winnings = res.winnerDetails;
        this.totalCoupons = this.winnings.length;
        this.currentWinnings = res.winnerDetails;

        for (const expiry of this.currentWinnings) {
          // if (Today - expired date > 7 days), the remove from winnerDetails

          if (
            Date.parse(expiry.expiryDate.split("T")[0]) > new Date().getTime()
          ) {
            expiry.couponExpired = false;
          } else if (
            Date.parse(expiry.expiryDate.split("T")[0]) <= new Date().getTime()
          ) {
            expiry.couponExpired = true;
          }
          if (!expiry.claimUrl.includes(".")) {
            expiry.isClaimUrlPresent = false;
          } else {
            expiry.isClaimUrlPresent = true;
          }
        }

        this.loading = false;
        this.getList(0);
        this.getList(1);
      });
  }

  /**
   * Returns list of brands and engagements for the dropdown menu
   * @param type 0 for brands, 1 for engagements
   */
  getList(type) {
    if (this.winnings) {
      let brandCount, engCount, categoryCount;
      let brands = [];
      let b1 = [];
      let engagements = [];
      let categories = [];

      this.winnings.forEach(c => {
        brandCount = this.winnings.reduce((n, coupon) => {
          return n + (coupon.name.toLowerCase() === c.name.toLowerCase());
        }, 0);

        brands.push({
          name: c.name,
          count: brandCount,
          selected: false
        });

        engCount = this.winnings.reduce((n, coupon) => {
          return (
            n +
            (coupon.programName.toLowerCase() === c.programName.toLowerCase())
          );
        }, 0);
        engagements.push({
          name: c.programName,
          count: engCount,
          selected: false
        });

        categoryCount = this.winnings.reduce((n, coupon) => {
          return (
            n + (coupon.category.toLowerCase() === c.category.toLowerCase())
          );
        }, 0);

        categories.push({
          name: c.category,
          count: categoryCount,
          selected: false
        });
      });

      this.brands = brands.filter(
        (v, i, a) => a.findIndex(t => t.name === v.name) === i
      );

      this.brands = this.brands.sort(function(a, b) {
        var nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB)
          //sort string ascending
          return -1;
        if (nameA > nameB) return 1;
        return 0; //default return value (no sorting)
      });

      this.engagements = engagements.filter(
        (v, i, a) => a.findIndex(t => t.name === v.name) === i
      );
      this.engagements = this.engagements.sort(function(a, b) {
        var nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB)
          //sort string ascending
          return -1;
        if (nameA > nameB) return 1;
        return 0; //default return value (no sorting)
      });

      this.categories = categories.filter(
        (v, i, a) => a.findIndex(t => t.name === v.name) === i
      );
      this.categories = this.categories.sort(function(a, b) {
        var nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB)
          //sort string ascending
          return -1;
        if (nameA > nameB) return 1;
        return 0; //default return value (no sorting)
      });
    }
  }

  /**
   * Return a list of coupons of the particular type.
   * @param type 0 for brands, 1 for engagements, 2 for categories
   * @param option data of the brand/engagement - eg. OYO
   */
  renderCoupons(type, option, desc) {
    // console.log(type, option);
    if (this.winnings) {
      this.all = false;
      this.showAll = true;
      let currentWinnings = [];

      if (type === 0 && desc.selected === false) {
        desc.selected = true; /*for upper like (close hotels(2))*/

        // this.filters = option;
        // this.count = desc.count;

        currentWinnings = this.winnings.filter(coupon => {
          return coupon.name.toLowerCase() == option.toLowerCase();
        });
      } else if (type === 1 && desc.selected === false) {
        desc.selected = true;

        currentWinnings = this.winnings.filter(coupon => {
          return coupon.programName.toLowerCase() == option.toLowerCase();
        });
      } else if (type === 2 && desc.selected === false) {
        desc.selected = true;

        currentWinnings = this.winnings.filter(coupon => {
          return coupon.category.toLowerCase() == option.toLowerCase();
        });
      }
      if (this.winnings.length === this.currentWinnings.length) {
        this.currentWinnings = currentWinnings;
      } else {
        this.currentWinnings = this.currentWinnings.concat(currentWinnings);
        console.log(
          this.currentWinnings
        ); /* Will get all the combined coupons*/
        // this.currentWinnings = this.currentWinnings.filter((x, i) => this.currentWinnings.some((y, j) => y === x && i !== j));
        console.log(
          this.currentWinnings
        ); /* Will get coupons which are repeated*/

        // this.currentWinnings = Object.values(this.currentWinnings.reduce((acc, cur) => Object.assign(acc, { [cur.name]: cur }), {}));
      }
      console.log(this.currentWinnings);
    }
  }

  setTab(tab) {
    this.activeTab = tab;
  }

  showHideFilter() {
    this.showContents = !this.showContents;
  }
  showHideBrands() {
    this.showBrands = !this.showBrands;
  }
  showHideCategories() {
    this.showCategories = !this.showCategories;
  }
  showHideEngagements() {
    this.showEngagements = !this.showEngagements;
  }

  close(index, type, desc) {
    if (type === 0) {
      // console.log(this.brands[index].name);
      // console.log(this.currentWinnings.findIndex(x => x.name.toLowerCase() == this.brands[index].name.toLowerCase()));
      // this.currentWinnings = this.currentWinnings.splice(this.currentWinnings.findIndex(item => item.name.toLowerCase() == this.brands[index].name.toLowerCase()), 1);
      this.currentWinnings = this.currentWinnings.filter(
        item => item.name.toLowerCase() != this.brands[index].name.toLowerCase()
      );
      desc.selected = false;
    } else if (type === 1) {
      this.currentWinnings = this.currentWinnings.filter(
        item =>
          item.programName.toLowerCase() !=
          this.engagements[index].name.toLowerCase()
      );
      desc.selected = false;
    } else if (type === 2) {
      this.currentWinnings = this.currentWinnings.filter(
        item =>
          item.category.toLowerCase() !=
          this.categories[index].name.toLowerCase()
      );
      desc.selected = false;
    }
    if (this.currentWinnings.length == 0 || type === 3) {
      this.currentWinnings = this.winnings;
      this.all = true;
      this.showAll = false;
      this.brands.forEach(brand => {
        brand.selected = false;
      });
      this.engagements.forEach(engagement => {
        engagement.selected = false;
      });
      this.categories.forEach(category => {
        category.selected = false;
      });
    }
    // this.all = true;
    // this.showHideFilter();
    // this.brands.forEach(brand => {
    //   brand.selected = false;
    // });
    // this.engagements.forEach(engagement => {
    //   engagement.selected = false;
    // });
    // this.categories.forEach(category => {
    //   category.selected = false;
    // });
  }

  copy(text, item) {
    this.trackerService.trackWithUserInfo(
      "Copy",
      "Middle",
      "Coupon submit button",
      item.planId,
      item.name,
      item.category,
      item.desc
    );
    this.trackerService.trackGACoupon(
      "Copy",
      "JioEngage | MyWinning page",
      item.planId,
      item.name,
      item.category,
      item.desc)
    this.clip.copyFromContent(text);

    this.showCopyMessage = true;
    item.selected = true;

    setTimeout(() => {
      item.selected = false;
    }, 2000);
  }

  claim(item) {
    this.trackerService.trackWithUserInfo(
      "Claim",
      "Middle",
      "Coupon submit button",
      item.planId,
      item.name,
      item.category,
      item.desc
    );
    this.trackerService.trackGACoupon(
      "Claim",
      "JioEngage | MyWinning page",
      item.planId,
      item.name,
      item.category,
      item.desc)
    this.externalInterfaceService.launchBrowser(item.claimUrl);
  }
  closeCopyMessage() {
    this.showCopyMessage = false;
  }
}
