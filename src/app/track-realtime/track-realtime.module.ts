import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackRealtimePageRoutingModule } from './track-realtime-routing.module';

import { TrackRealtimePage } from './track-realtime.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackRealtimePageRoutingModule
  ],
  declarations: [TrackRealtimePage]
})
export class TrackRealtimePageModule {}
