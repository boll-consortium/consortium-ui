import {Routes, RouterModule} from '@angular/router';
import {IndexComponent} from './components/index/index.component';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {LogoutComponent} from "./components/logout/logout/logout.component";
import {AuthFilterGuard} from "./guards/auth/auth-filter.guard";
import {LearningRecordsComponent} from "./components/learning-records/learning-records.component";
import {SchoolsComponent} from "./components/schools/schools.component";
import {PermissionsComponent} from "./components/permissions/permissions.component";
import {SettingsComponent} from "./components/settings/settings.component";
import {LearnersComponent} from "./components/learners/learners.component";

const appRoutes: Routes = [
  {path: 'contracts/:ethAddress/:indexContract', component: IndexComponent, canActivate: [AuthFilterGuard]},
  {path: 'learning-records', component: LearningRecordsComponent, canActivate: [AuthFilterGuard]},
  {path: 'learning-records/:school_address', component: LearningRecordsComponent, canActivate: [AuthFilterGuard]},
  {path: 'schools', component: SchoolsComponent, canActivate: [AuthFilterGuard]},
  {path: 'learners', component: LearnersComponent, canActivate: [AuthFilterGuard]},
  {path: 'permissions', component: PermissionsComponent, canActivate: [AuthFilterGuard]},
  {path: 'permissions/:contract_address', component: PermissionsComponent, canActivate: [AuthFilterGuard]},
  {path: 'permissions/:school_address/:contract_address', component: PermissionsComponent, canActivate: [AuthFilterGuard]},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthFilterGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'signout', component: LogoutComponent},
  /*{path: 'home/:view', component: HomeComponent, canActivate: [AuthFilterGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthFilterGuard]},*/
  {path: '**', component: SchoolsComponent, canActivate: [AuthFilterGuard]}
];

export const Routing = RouterModule.forRoot(appRoutes);
