import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackRealtimePage } from './track-realtime.page';

const routes: Routes = [
  {
    path: '',
    component: TrackRealtimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackRealtimePageRoutingModule {}
