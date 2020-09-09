import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';

import { AppService } from './app.service';
import { LoggerService } from './logger.service';
import { EventEmitterService } from './event-emitter.service';

declare const window: any;
declare const webkit: any;

@Injectable({
  providedIn: 'root'
})
export class ExternalInterfaceService {
  public subject$: Subject<any> = new Subject();

  constructor(
    private zone: NgZone,
    private router: Router,
    private appService: AppService,
    private logger: LoggerService,
    private eventEmitterService: EventEmitterService
  ) {
    this.setupCallbacksFromNative();
  }

  share(data) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'share',
          desc: data
        })
      )
    );
  }

  playSound(audioObj) {
    this.stopSound();
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'playinternalsound',
          path: audioObj.path || null,
          loop: audioObj.loop || false,
          name: audioObj.name || null
        })
      )
    );
  }

  stopSound() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'stopsound'
        })
      )
    );
  }

  launchBrowser(url) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'launchbrowser',
          value: url
        })
      )
    );
  }

  sendLoadComplete() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'loadingCompleted'
        })
      )
    );
  }

  close() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'close'
        })
      )
    );
  }

  requestJWT() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'jwt'
        })
      )
    );
  }

  requestMicrophone() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'microphone',
          config: {
            type: 'speech',
            language: 'en'
          }
        })
      )
    );
  }

  makeCall(value) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'makeCall',
          value: value
        })
      )
    );
  }

  requestScreenshot() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'screenshot'
        })
      )
    );
  }

  requestForUserPermission(permission) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'requestForUserPermission',
          value: permission
        })
      )
    );
  }
  openScreenZ(data) {
    this.externalCall(
      btoa(
        JSON.stringify({
            type: 'openScreenz',
            value: { PID: data.pid, UID: data.uid, pageId: data.pageid }
            })
          )
      );
    }

  requestAdParams() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'adparams'
        })
      )
    );
  }

  getNativeVersion(permission) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'getNativeVersion'
        })
      )
    );
  }

  private externalCall(data) {
    try {
      if (window.android && window.android.__externalCall) {
        window.android.__externalCall(data);
      }
      if (window.__externalCall) {
        window.__externalCall(data);
      }
      webkit.messageHandlers.callback.postMessage(data);
    } catch (e) {
      this.logger.error('external call failed');
    }
  }

  public setupCallbacksFromNative() {
    window.sendJwt = jwt => {
      this.zone.run(() => {
        this.appService.setUserInfo({ jwt: jwt });
        this.router.navigate(['/']);
      });
    };

    window.sendTextForSpeech = text => {
      // alert(text);
      this.eventEmitterService.emit({ type: 'TEXT_FROM_NATIVE', data: text });
    };

    window.sendScreenshot = text => {
      // alert(text);
      // this.eventEmitterService.emit({ type: 'TEXT_FROM_NATIVE', data: text });
    };

    window.sendNativeVersion = text => {
      alert(text);
      // this.eventEmitterService.emit({ type: 'TEXT_FROM_NATIVE', data: text });
    };

    window.sendAdParams = params => {
      // params will have latitude, longitude, Adid, OS
      window.AD_USER = {
        userIfa: JSON.parse(params).Adid,
        city: ''
      };
      this.eventEmitterService.emit({
        type: 'AD_PARAMS',
        data: JSON.parse(params)
      });
    };

    window.ADSDKEXT = {};
    window.ADSDKEXT.click_handler = url => this.launchBrowser(url);
  }
}
