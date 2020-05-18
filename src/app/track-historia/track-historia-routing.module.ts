import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackHistoriaPage } from './track-historia.page';

const routes: Routes = [
  {
    path: '',
    component: TrackHistoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackHistoriaPageRoutingModule {}
