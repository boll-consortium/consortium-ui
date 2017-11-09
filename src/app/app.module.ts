import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import {Routing} from './app.routing';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { LeftSidebarComponent } from './shared/left-sidebar/left-sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AsideControlComponent } from './shared/aside-control/aside-control.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterParticipantComponent } from './components/register-participant/register-participant.component';

import {RegistrarContractService} from './services/contract/registrar-contract.service';
import {DbService} from "./services/db.service";
import { IndexComponent } from './components/index/index.component';
import {RouterModule} from '@angular/router';
import {IndexContractService} from './services/contract/index-contract.service';

@NgModule({
  declarations: [
    IndexComponent,
    AppComponent,
    HeaderComponent,
    LeftSidebarComponent,
    FooterComponent,
    AsideControlComponent,
    HomeComponent,
    RegisterParticipantComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    Routing
  ],
  providers: [RegistrarContractService, DbService, IndexContractService],
  bootstrap: [HeaderComponent, LeftSidebarComponent, AppComponent, FooterComponent, AsideControlComponent]
})
export class AppModule { }
