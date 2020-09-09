import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AuthGuard } from './guards/auth.guard';

import { AppService } from './services/app.service';
import { RestService } from './services/rest.service';
import { LoggerService } from './services/logger.service';
import { UtilService } from './services/util.service';
import { EventEmitterService } from './services/event-emitter.service';
import { ExternalInterfaceService } from './services/external-interface.service';
import { TrackerService } from './services/tracker.service';
import { PadPipe } from './pipes/pad.pipe';

const services = [ AppService, RestService, LoggerService,TrackerService, ExternalInterfaceService, EventEmitterService, UtilService ];
const pipes = [ PadPipe ];
const guards = [ AuthGuard ];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    ...pipes
  ],
  providers: [
  ...services,
  ...guards
  ],
  exports: [
    ...pipes
  ]
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
