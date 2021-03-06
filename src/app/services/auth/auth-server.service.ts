import {Injectable} from '@angular/core';
import {AuthCredentialsService} from "./auth-credentials/auth-credentials.service";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {SessionStateService} from "../global/session-state.service";
import {HttpInterceptorService} from "../http/http-interceptor.service";

@Injectable()
export class AuthServerService {

  constructor(private sessionStateService: SessionStateService,
              private httpInterceptorService: HttpInterceptorService) {
  }

  public loginUser(data: any) {
    const observer = new ReplaySubject(2);
    if (data) {
      this.httpInterceptorService.axiosInstance.post(AuthCredentialsService.AUTH_SERVER_URL_LOGIN, data).then(
        (response) => {
          observer.next(response);
        }).catch((error) => {
        console.log(error);
        observer.next(error);
      });
    }
    return observer;
  }

  public loginUserByToken(token: string, bollAddress: string) {
    const observer = new ReplaySubject(2);
    if (token) {
      this.httpInterceptorService.axiosInstance.post(AuthCredentialsService.AUTH_SERVER_URL_LOGIN_BY_TOKEN, {
        token: token,
        bollAddress: bollAddress
      }).then(
        (response) => {
          observer.next(response);
        }).catch((error) => {
        console.log(error);
        observer.next(error);
      });
    }
    return observer;
  }

  public logout(bollAddress: string, token: string) {
    const observer = new ReplaySubject(2);
    if (token) {
      this.httpInterceptorService.axiosInstance.post(AuthCredentialsService.AUTH_SERVER_URL_LOGOUT, {}, {
        headers: {
          'Authorization': btoa(bollAddress + ':' + token),
          'Content-Type': 'application/json'
        }
      }).then(
        (response) => {
          observer.next(response);
        }).catch((error) => {
        console.log(error);
        observer.next(error);
      });
    }
    return observer;
  }

  public registerInstitute(data: any) {
    const observer = new ReplaySubject(2);
    if (data) {
      this.httpInterceptorService.axiosInstance.post(AuthCredentialsService.AUTH_SERVER_URL_REGISTER_INSTITUTE, data).then(
        (response) => {
          observer.next(response);
        }).catch((error) => {
        console.log(error);
        observer.next(error);
      });
    }
    return observer;
  }

  public grantPermissions(bollAddress: string, token: string, data) {
    const observer = new ReplaySubject(2);
    if (token) {
      this.httpInterceptorService.axiosInstance.post(AuthCredentialsService.AUTH_SERVER_URL_GRANT_PERMISSION, data, {
        headers: {
          'Authorization': btoa(bollAddress + ':' + token),
          'Content-Type': 'application/json'
        }
      }).then(
        (response) => {
          observer.next(response);
        }).catch((error) => {
        console.log(error);
        observer.next(error);
      });
    }
    return observer;
  }

  public grantAllPermissions(bollAddress: string, token: string, data) {
    const observer = new ReplaySubject(2);
    if (token) {
      this.httpInterceptorService.axiosInstance.post(AuthCredentialsService.AUTH_SERVER_URL_GRANT_ALL_PERMISSION, data, {
        headers: {
          'Authorization': btoa(bollAddress + ':' + token),
          'Content-Type': 'application/json'
        }
      }).then(
        (response) => {
          observer.next(response);
        }).catch((error) => {
        console.log(error);
        observer.next(error);
      });
    }
    return observer;
  }

  public registerLearner(data: any) {
    const observer = new ReplaySubject(2);
    if (data) {
      this.httpInterceptorService.axiosInstance.post(AuthCredentialsService.AUTH_SERVER_URL_REGISTER_LEARNER, data).then(
        (response) => {
          observer.next(response);
        }).catch((error) => {
        console.log(error);
        observer.next(error);
      });
    }
    return observer;
  }

  public getLogs(blockchainAddress: string, token: string) {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL_READ_LOGS, {
      data: {},
      headers: {
        'Authorization': btoa(blockchainAddress + ':' + token),
        'Content-Type': 'application/json'
      }
    }).then(
      (response) => {
        observer.next(response);
      }).catch((error) => {
      console.log(error);
      observer.next(error);
    });
    return observer;
  }

  public getLogsBySchool(blockchainAddress: string, token: string, schoolAddress: string) {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL_READ_SCHOOL_LOGS, {
      data: {},
      params: {schoolAddress: schoolAddress},
      headers: {
        'Authorization': btoa(blockchainAddress + ':' + token),
        'Content-Type': 'application/json'
      }
    }).then(
      (response) => {
        observer.next(response);
      }).catch((error) => {
      console.log(error);
      observer.next(error);
    });
    return observer;
  }

  public getLatestLogs(blockchainAddress: string, token: string, schoolAddress: string) {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL_READ_LATEST_LOG, {
      data: {},
      params: {schoolAddress: schoolAddress},
      headers: {
        'Authorization': btoa(blockchainAddress + ':' + token),
        'Content-Type': 'application/json'
      }
    }).then(
      (response) => {
        observer.next(response);
      }).catch((error) => {
      console.log(error);
      observer.next(error);
    });
    return observer;
  }

  public getLatestLogsOnContract(blockchainAddress: string, token: string, schoolAddress: string, contractAddress: string) {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL_CONTRACT_LATEST_LOG, {
      data: {},
      params: {schoolAddress: schoolAddress, contractAddress: contractAddress},
      headers: {
        'Authorization': btoa(blockchainAddress + ':' + token),
        'Content-Type': 'application/json'
      }
    }).then(
      (response) => {
        observer.next(response);
      }).catch((error) => {
      console.log(error);
      observer.next(error);
    });
    return observer;
  }

  public getMyCourses(blockchainAddress: string, token: string, schoolAddress: string) {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL_GET_MY_COURSES, {
      data: {},
      params: {schoolAddress: schoolAddress},
      headers: {
        'Authorization': btoa(blockchainAddress + ':' + token),
        'Content-Type': 'application/json'
      }
    }).then(
      (response) => {
        observer.next(response);
      }).catch((error) => {
      console.log(error);
      observer.next(error);
    });
    return observer;
  }

  public getMyStudents(blockchainAddress: string, token: string, schoolAddress: string, courseId: string) {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL_GET_MY_STUDENTS, {
      data: {},
      params: {schoolAddress, courseId},
      headers: {
        'Authorization': btoa(blockchainAddress + ':' + token),
        'Content-Type': 'application/json'
      }
    }).then(
      (response) => {
        observer.next(response);
      }).catch((error) => {
      console.log(error);
      observer.next(error);
    });
    return observer;
  }

  public getStudentAddress(blockchainAddress: string, token: string, schoolAddress: string, userId: string) {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL_GET_STUDENT_ADDRESS, {
      data: {},
      params: {schoolAddress, userId},
      headers: {
        'Authorization': btoa(blockchainAddress + ':' + token),
        'Content-Type': 'application/json'
      }
    }).then(
      (response) => {
        observer.next(response);
      }).catch((error) => {
      console.log(error);
      observer.next(error);
    });
    return observer;
  }

  public getMySchools(blockchainAddress: string, token: string, userId: string, userBlockchainAddress: string) {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL_GET_MY_SCHOOLS, {
      data: {},
      params: {userId, userBlockchainAddress},
      headers: {
        'Authorization': btoa(blockchainAddress + ':' + token),
        'Content-Type': 'application/json'
      }
    }).then(
      (response) => {
        observer.next(response);
      }).catch((error) => {
      console.log(error);
      observer.next(error);
    });
    return observer;
  }

}
