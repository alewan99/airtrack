import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {CsvUtil} from '../utils/CsvUtil';
import {DeviceService} from '../services/DeviceService';
import {TaskService} from '../services/TaskService';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, FullCalendarModule, IonicModule.forRoot(),
    AppRoutingModule, HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
      CsvUtil,
    DeviceService,
    TaskService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
