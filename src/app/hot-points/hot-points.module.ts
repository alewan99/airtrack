import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HotPointsPageRoutingModule } from './hot-points-routing.module';

import { HotPointsPage } from './hot-points.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HotPointsPageRoutingModule
  ],
  declarations: [HotPointsPage]
})
export class HotPointsPageModule {}
