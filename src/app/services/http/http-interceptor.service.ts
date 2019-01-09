import {Injectable} from "@angular/core";
import {ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Router, ActivatedRoute, Params} from '@angular/router';
import {SessionStateService} from "../global/session-state.service";

@Injectable()
export class HttpInterceptorService extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions,
              private route: ActivatedRoute,
              private router: Router,
              private sessionStateService: SessionStateService) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options).catch(res => {
      this.authenticationError(res.json());
      return Observable.of(res);

    });
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.get(url, this.getRequestOptionArgs(options)).catch(res => {
      return Observable.of(res);

    });
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.post(url, body, this.getRequestOptionArgs(options)).catch(res => {
      this.authenticationError(res.json());
      return Observable.of(res);

    });
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.put(url, body, this.getRequestOptionArgs(options)).catch(res => {
      this.authenticationError(res);
      return Observable.of(res);

    });
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.delete(url, this.getRequestOptionArgs(options)).catch(res => {
      this.authenticationError(res);
      return Observable.of(res);
    });
  }

  private authenticationError(res: any) {
    console.log("HTTP Connection intercepted...");
    if ((res.error.code === 401 || res.data['sessionExpired']) && res.url.indexOf('/login') === 0) {
      this.sessionStateService.clearAll();
      this.router.navigate(['/login']);
    }
  }

  private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }

    return options;
  }
}
