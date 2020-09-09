import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private specialCharacters = /([`~!@#$%^&*()_+=\[\]{}\\|'";:\/?.>,<])/g;

  getParameterByName(name, url?) {
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

  sanitize(input: string) {
    return input.replace(this.specialCharacters, '');
  }

  clone(val) {
    return JSON.parse(JSON.stringify(val));
  }
}
