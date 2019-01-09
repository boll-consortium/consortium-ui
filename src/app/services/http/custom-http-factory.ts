import { XHRBackend, Http, RequestOptions, ConnectionBackend } from "@angular/http";
import {HttpInterceptorService} from "./http-interceptor.service";
import { ActivatedRoute, Router } from "@angular/router";
import {SessionStateService} from "../global/session-state.service";
export function customHttpFactory(backend: ConnectionBackend, defaultOptions: RequestOptions,
                                  route: ActivatedRoute,
                                  router: Router,
                                  sessionStateService: SessionStateService) {
  return new HttpInterceptorService(backend, defaultOptions, route, router, sessionStateService);
}
