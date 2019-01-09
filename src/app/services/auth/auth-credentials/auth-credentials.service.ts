import {Injectable} from '@angular/core';

@Injectable()
export class AuthCredentialsService {
  public static API_CLIENT_CREDENTIALS = {
    GOOGLE: {
      CLIENT_ID: '489430961108-40lf5al8fla0fta8qe489hcic10hi3t0.apps.googleusercontent.com',
      KEY: 'AIzaSyA5zgjGFtCcQuwi_eCrLBuH5ePDzYSAgAI',
      SECRET: 'kT2eCJd9vV5L1jFXv1f17D-g'
    },
    FACEBOOK: {
      APP_ID: '1995449750733639',
      SECRET: '0d84e6070a8b67d222c76c96c3be08ad',
      VERSION: 'v2.11'
    }
  };
  public static loginSources = {GOOGLE: 'google', FACEBOOK: 'facebook', EMAIL: 'email' };
  public static AUTH_SERVER_URL = '/';
  public static AUTH_SERVER_URL_LOGIN = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/login';
  public static AUTH_SERVER_URL_LOGIN_BY_TOKEN = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/login/token';
  public static AUTH_SERVER_URL_REGISTER_LEARNER = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/register';
  public static AUTH_SERVER_URL_REGISTER_INSTITUTE = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/join/apply';
  public static AUTH_SERVER_URL_READ_LOGS = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/logs';
  public static AUTH_SERVER_URL_READ_LATEST_LOG = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/logs/latest';

  constructor() { }

}
