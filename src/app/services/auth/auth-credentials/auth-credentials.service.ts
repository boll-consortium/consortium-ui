import {Injectable} from '@angular/core';

declare var $: any;

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
  public static AUTH_SERVER_URL = $('base').attr('href').endsWith('/') ? $('base').attr('href') : $('base').attr('href') + '/';
  public static AUTH_SERVER_URL_LOGIN = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/login';
  public static AUTH_SERVER_URL_LOGIN_BY_TOKEN = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/login/token';
  public static AUTH_SERVER_URL_LOGOUT = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/logout';
  public static AUTH_SERVER_URL_REGISTER_LEARNER = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/register';
  public static AUTH_SERVER_URL_REGISTER_INSTITUTE = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/join/apply';
  public static AUTH_SERVER_URL_GRANT_PERMISSION = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/create/grant_permission';
  public static AUTH_SERVER_URL_GRANT_ALL_PERMISSION = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/create/grant_permission/all';
  public static AUTH_SERVER_URL_READ_LOGS = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/logs';
  public static AUTH_SERVER_URL_READ_SCHOOL_LOGS = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/logs/school';
  public static AUTH_SERVER_URL_READ_LATEST_LOG = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/logs/latest';
  public static AUTH_SERVER_URL_CONTRACT_LATEST_LOG = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/logs/contract';
  public static AUTH_SERVER_URL_GET_MY_COURSES = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/lms/get_courses';
  public static AUTH_SERVER_URL_GET_MY_STUDENTS = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/lms/get_enroled_students';
  public static AUTH_SERVER_URL_GET_STUDENT_ADDRESS = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/student/get_address';
  public static AUTH_SERVER_URL_GET_MY_SCHOOLS = AuthCredentialsService.AUTH_SERVER_URL + 'sb/identity/student/get_schools';

  constructor() { }

}
