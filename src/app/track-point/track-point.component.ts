import {Component, Input, OnInit} from '@angular/core';
import {TrackData} from '../../model/TrackData';

@Component({
  selector: 'app-track-point',
  templateUrl: './track-point.component.html',
  styleUrls: ['./track-point.component.scss'],
})
export class TrackPointComponent implements OnInit {

  // private mTrackPoint: TrackData = {
  //   deviceId: null,
  //   time: null,
  //   lat: null,
  //   lng: null,
  //   no2: 0 ,
  //   co: 0 ,
  //   o3: 0 ,
  //   so2: 0 ,
  //   pm1: 0 ,
  //   pm2_5: 0 ,
  //   pm10: 0 ,
  //   temp: 0 ,
  //   humi: 0 ,
  //   flog: 0 ,
  //   voc: 0
  // };

  @Input() trackPoint: TrackData;

  constructor() { }

  ngOnInit() {}

}
