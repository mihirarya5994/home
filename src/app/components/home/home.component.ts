import { ProfileService } from "src/app/core/services/profile.service";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { RestService } from "src/app/core/services/rest.service";
import Swiper from "swiper";
import { Router } from "@angular/router";
import { AppService } from "src/app/core/services/app.service";
import { TrackerService } from "src/app/core/services/tracker.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  type = "dashboard";

  data;
  loading;
  appsData;
  favouriteApps = [];
  userInfo;
  device;
  latestGames;
  recommended;
  constructor(
    private appService: AppService,
    private restService: RestService,
    private profile: ProfileService,
    private trackerService: TrackerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userInfo = this.appService.getUserInfo();
    this.device = this.appService.getOS();
    console.log(this.device);
    this.loading = true;
    // this.trackerService.trackPage("JioEngage Home Page");
    this.trackerService.trackGAPageLoad("JioEngage |Home page")
    this.restService.get("assets/config/games.json").subscribe(res => {
      this.latestGames = res.latestGames;
      this.recommended = res.recommended;

      this.loading = false;

      this.data = res;
      this.appsData = Array.prototype.concat(res.recommended, res.info);
      if (this.data) {
        this.getLikedApps();
      }
    });
  }

  // checkForRFDbanner() {
  //   return this.restService.get(
  //     "https://founderdayapi.jioengageapps.com/bingoapi/iswhitelisted/family"
  //   );
  // }

  getLikedApps() {
    const url =
      this.appService.getConfigParam("PROFILE_API_HOST") +
      "/api/users/apps/like";
    this.restService.get(url).subscribe(res => {
      const r = res.appLikes;
      r.forEach(e => {
        if (e.appId) {
          this.appsData.forEach(a => {
            if (e.appId === a.appId) {
              a.liked = true;
              this.favouriteApps.push(a);
            }
          });
        }
      });
    });
  }

  likeApp(app) {
    const url =
      this.appService.getConfigParam("PROFILE_API_HOST") +
      "/api/users/apps/like/" +
      app.appId;
    this.restService.put(url, {}).subscribe(
      res => {
        app.liked = true;
        this.favouriteApps.push(app);
        // this.getLikedApps();
      },
      err => {
        return;
      }
    );
  }

  dislikeApp(app) {
    const url =
      this.appService.getConfigParam("PROFILE_API_HOST") +
      "/api/users/apps/like/" +
      app.appId;
    this.restService.delete(url).subscribe(
      res => {
        this.appsData.forEach(d => {
          if (d.appId === app.appId) {
            const index = this.favouriteApps.indexOf(d);
            this.favouriteApps.splice(index, 1);
            d.liked = false;
            return;
          }
        });
      },
      err => {
        return;
      }
    );
  }
}
