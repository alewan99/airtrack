import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackCalendarPage } from './track-calendar.page';

const routes: Routes = [
  {
    path: '',
    component: TrackCalendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackCalendarPageRoutingModule {}
