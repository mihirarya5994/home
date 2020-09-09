import { element } from 'protractor';
import { Router } from '@angular/router';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { TrackerService } from 'src/app/core/services/tracker.service';
// import * as screenfull from 'screenfull';
@Component({
  selector: 'app-fun-games',
  templateUrl: './fun-games.component.html',
  styleUrls: ['./fun-games.component.scss']
})
export class FunGamesComponent implements OnInit {
  @Input() data;

  constructor(
    private router: Router,
    private trackerService:TrackerService
    ) {}

  ngOnInit() {}

  launchGame(game) {
    // this.trackerService.trackLink(game.title, game.linkPosition , 'GameLaunch');
    this.trackerService.trackGAClickTrack('Fun Game',game.title)
    this.router.navigate([`/tpgames/${game.id}`]);
  }
}
