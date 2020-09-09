import { Component, OnInit } from '@angular/core';

import { AppService } from './core/services/app.service';
import { LoggerService } from './core/services/logger.service';
import { ExternalInterfaceService } from './core/services/external-interface.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TrackerService } from './core/services/tracker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showFooter = false;
  constructor(
    private appService: AppService,
    private logger: LoggerService,
    private externalInterfaceService: ExternalInterfaceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private trackerService: TrackerService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (this.activatedRoute.snapshot.firstChild) {
          this.showFooter = this.activatedRoute.snapshot.firstChild.data.showFooter;
        }
      });
  }

  ngOnInit() {
    this.logger.setLogging(this.appService.getConfigParam('LOGS_ENABLED'));
    this.externalInterfaceService.sendLoadComplete();
    this.trackerService.initialize('jioengage home page');
  }
}
