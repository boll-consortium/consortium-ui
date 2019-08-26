import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';

import {Routing} from './app.routing';

import {AppComponent} from './app.component';
import {HeaderComponent} from './shared/header/header.component';
import {LeftSidebarComponent} from './shared/left-sidebar/left-sidebar.component';
import {FooterComponent} from './shared/footer/footer.component';
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
import {AuthCredentialsService} from "./services/auth/auth-credentials/auth-credentials.service";
import {AuthServerService} from "./services/auth/auth-server.service";
import {WebStorageModule} from "ngx-store";
import {LogoutComponent} from './components/logout/logout/logout.component';
import {LearningProvidersComponent} from './components/learning-providers/learning-providers/learning-providers.component';
import {AuthFilterGuard} from "./guards/auth/auth-filter.guard";
import {SelectModule} from 'ng-select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
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
import {HighlightTransformer} from "./shared/util/HighlightTransformer";
import {AnalyticsComponent} from './components/analytics/analytics.component';
import {ScoresComponent} from './components/school/scores/scores.component';
import {AuthFilterAdminGuard} from "./guards/auth/auth-filter-admin.guard";
import { StudentsComponent } from './components/school/students/students.component';
import { NotificationsComponent } from './components/school/notifications/notifications.component';
import { StudentProfileComponent } from './components/school/student-profile/student-profile.component';
import { LearningLogsSortComponent } from './components/school/learning-logs-sort/learning-logs-sort.component';
import { CourseComponent } from './components/school/learning_logs_sort/course/course.component';
import {AutocompleteLibModule} from "angular-ng-autocomplete";

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
    SchoolPermissionsComponent,
    HighlightTransformer,
    AnalyticsComponent,
    ScoresComponent,
    StudentsComponent,
    NotificationsComponent,
    StudentProfileComponent,
    LearningLogsSortComponent,
    CourseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    Routing,
    WebStorageModule,
    SelectModule,
    PdfViewerModule,
    AutocompleteLibModule
  ],
  providers: [HttpInterceptorService, RegistrarContractService, DbService, IndexContractService,
    SessionStateService, AuthCredentialsService,
    AuthFilterGuard, AuthFilterAdminGuard, AuthServerService, SettingsService],
  bootstrap: [LeftSidebarComponent, AppComponent, FooterComponent, MainContentComponent]
})
export class AppModule {
}
