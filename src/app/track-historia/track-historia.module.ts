import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackHistoriaPageRoutingModule } from './track-historia-routing.module';

import { TrackHistoriaPage } from './track-historia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackHistoriaPageRoutingModule
  ],
  declarations: [TrackHistoriaPage]
})
export class TrackHistoriaPageModule {}
