import {Routes, RouterModule} from '@angular/router';
import {IndexComponent} from './components/index/index.component';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register/register.component";
import {LogoutComponent} from "./components/logout/logout/logout.component";
import {AuthFilterGuard} from "./guards/auth/auth-filter.guard";

const appRoutes: Routes = [
  {path: 'contracts/:ethAddress/:indexContract', component: IndexComponent, canActivate: [AuthFilterGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'signout', component: LogoutComponent},
  {path: '**', component: HomeComponent, canActivate: [AuthFilterGuard]}
];

export const Routing = RouterModule.forRoot(appRoutes);
