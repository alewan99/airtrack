import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackCalendarPageRoutingModule } from './track-calendar-routing.module';

import { TrackCalendarPage } from './track-calendar.page';
import {FullCalendarModule} from '@fullcalendar/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackCalendarPageRoutingModule,
    FullCalendarModule

  ],
  declarations: [TrackCalendarPage]
})
export class TrackCalendarPageModule {}
