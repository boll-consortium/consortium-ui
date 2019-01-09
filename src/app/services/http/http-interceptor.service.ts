import {Injectable} from "@angular/core";
import Axios from "axios";
import {isNullOrUndefined} from "util";

@Injectable()
export class HttpInterceptorService {
  public axiosInstance: any;

  constructor() {
    this.axiosInstance = Axios.create();
    this.axiosInstance.interceptors.response.use(function (response) {
      // Do something with response data
      console.log("HTTP Connection intercepted...");
      if (((!isNullOrUndefined(response.error) && response.error.code === 401) || response.data['sessionExpired'])
        && (isNullOrUndefined(response.url) || response.url.indexOf('/login') === 0)) {
        this.sessionStateService.clearAll();
        if (this.inIframe()) {
          window.location.reload(false);
          return null;
        } else {
          this.router.navigate(['/login']);
          return null;
        }
      }
      return response;
    }, function (error) {
      // Do something with response error
      return Promise.reject(error);
    });
  }

  inIframe(): boolean {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
}
