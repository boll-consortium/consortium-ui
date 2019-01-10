import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';

import {Routing} from './app.routing';

import {AppComponent} from './app.component';
import {HeaderComponent} from './shared/header/header.component';
import {LeftSidebarComponent} from './shared/left-sidebar/left-sidebar.component';
import {FooterComponent} from './shared/footer/footer.component';
import {AsideControlComponent} from './shared/aside-control/aside-control.component';
import {HomeComponent} from './components/home/home.component';
import {RegisterParticipantComponent} from './components/register-participant/register-participant.component';

import {RegistrarContractService} from './services/contract/registrar-contract.service';
import {DbService} from "./services/db.service";
import {IndexComponent} from './components/index/index.component';
import {RouterModule} from '@angular/router';
import {IndexContractService} from './services/contract/index-contract.service';
import {LoginComponent} from './components/login/login.component';
import {SessionStateService} from "./services/global/session-state.service";
import {MainContentComponent} from './shared/content-wrapper/main-content/main-content.component';
import {RegisterComponent} from './components/register/register.component';
import {Angular2SocialLoginModule} from "angular2-social-login";
import {AuthCredentialsService} from "./services/auth/auth-credentials/auth-credentials.service";
import {AuthServerService} from "./services/auth/auth-server.service";
import {WebStorageModule} from "ngx-store";
import {AuthCryptoService} from "./services/auth/auth-crypto/auth-crypto.service";
import {LogoutComponent} from './components/logout/logout/logout.component';
import {EthCommunicationService} from "./services/contract/eth-communication.service";
import {LearningProvidersComponent} from './components/learning-providers/learning-providers/learning-providers.component';
import {AuthFilterGuard} from "./guards/auth/auth-filter.guard";
import {SelectModule} from 'ng-select';
import {PermissionsComponent} from './components/permissions/permissions.component';
import {LearningRecordsComponent} from './components/learning-records/learning-records.component';
import {SchoolsComponent} from './components/schools/schools.component';
import {SettingsComponent} from './components/settings/settings.component';
import {InnerHeaderComponent} from './shared/inner-header/inner-header.component';
import {ActivityLoggerComponent} from './shared/activity-logger/activity-logger.component';
import {LearnersComponent} from './components/learners/learners.component';
import {SettingsService} from "./services/settings/settings.service";
import {HttpInterceptorService} from "./services/http/http-interceptor.service";
import {SchoolComponent} from './components/school/school.component';
import {LearningRecordsComponent as SchoolLearningRecordsComponent} from './components/school/learning-records/learning-records.component';
import {AccessLogsComponent} from './components/school/access-logs/access-logs.component';
import {PermissionsComponent as SchoolPermissionsComponent} from "./components/school/permissions/permissions.component";
import {InfoComponent} from './components/school/info/info.component';

const providers = {
  "google": {
    "clientId": AuthCredentialsService.API_CLIENT_CREDENTIALS.GOOGLE.CLIENT_ID
  },
  "facebook": {
    "clientId": AuthCredentialsService.API_CLIENT_CREDENTIALS.FACEBOOK.APP_ID,
    "apiVersion": AuthCredentialsService.API_CLIENT_CREDENTIALS.FACEBOOK.VERSION // like v2.4
  }
};

@NgModule({
  declarations: [
    IndexComponent,
    AppComponent,
    HeaderComponent,
    LeftSidebarComponent,
    FooterComponent,
    AsideControlComponent,
    HomeComponent,
    RegisterParticipantComponent,
    LoginComponent,
    MainContentComponent,
    RegisterComponent,
    LogoutComponent,
    LearningProvidersComponent,
    PermissionsComponent,
    LearningRecordsComponent,
    SchoolsComponent,
    SettingsComponent,
    InnerHeaderComponent,
    LearnersComponent,
    ActivityLoggerComponent,
    SchoolComponent,
    SchoolLearningRecordsComponent,
    AccessLogsComponent,
    InfoComponent,
    SchoolPermissionsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    Routing,
    Angular2SocialLoginModule,
    WebStorageModule,
    SelectModule
  ],
  providers: [HttpInterceptorService, RegistrarContractService, DbService, IndexContractService,
    SessionStateService, AuthCredentialsService,
    AuthFilterGuard, AuthServerService, AuthCryptoService, EthCommunicationService, SettingsService],
  bootstrap: [HeaderComponent, LeftSidebarComponent, AppComponent, FooterComponent, MainContentComponent]
})
export class AppModule {
}

Angular2SocialLoginModule.loadProvidersScripts(providers);
