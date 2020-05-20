import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'track-historia',
    loadChildren: () => import('./track-historia/track-historia.module').then( m => m.TrackHistoriaPageModule)
  },
  {
    path: 'track-realtime',
    loadChildren: () => import('./track-realtime/track-realtime.module').then( m => m.TrackRealtimePageModule)
  },
  {
    path: 'device-list',
    loadChildren: () => import('./device-list/device-list.module').then( m => m.DeviceListPageModule)
  },  {
    path: 'hot-points',
    loadChildren: () => import('./hot-points/hot-points.module').then( m => m.HotPointsPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
