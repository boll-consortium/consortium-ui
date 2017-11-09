import {Routes, RouterModule} from '@angular/router';
import {IndexComponent} from './components/index/index.component';
import {HomeComponent} from './components/home/home.component';

const appRoutes: Routes = [
  {path: 'contracts/:ethAddress/:indexContract', component: IndexComponent},
  {path: '**', component: HomeComponent}
];

export const Routing = RouterModule.forRoot(appRoutes);
