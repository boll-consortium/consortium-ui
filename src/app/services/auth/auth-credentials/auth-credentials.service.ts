import { Injectable } from '@angular/core';

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
  public static AUTH_SERVER_URL = '/auth/';

  constructor() { }

}