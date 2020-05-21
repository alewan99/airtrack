import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Feature} from 'geojson';

@Component({
  selector: 'app-hot-points',
  templateUrl: './hot-points.page.html',
  styleUrls: ['./hot-points.page.scss'],
})
export class HotPointsPage implements OnInit {

  constructor(public http: HttpClient) {
  }


  @Input()
  set hotPoints(values: Array<Feature>) {
    this.mHotPoints = values;
    this.pageIndex = 0;
    // https://restapi.amap.com/v3/geocode/regeo?parameters
    this.pageCount = this.mHotPoints.length % 20 === 0 ?
        parseInt((this.mHotPoints.length / 20).toString(), 0) :
        parseInt((this.mHotPoints.length / 20).toString(), 0) + 1;
    this.loadAddresses();

  }


  get hotPoints() {
    return this.mHotPoints;
  }


  mHotPoints: Array<Feature> = [];

  pageSize = 20;
  pageIndex;
  pageCount;

  ngOnInit() {

  }

  loadAddresses() {
    const batchPoints =
        this.pageIndex === (this.pageCount - 1) ? this.mHotPoints.slice(this.pageIndex * this.pageSize) :
            this.mHotPoints.slice(this.pageIndex * this.pageSize, this.pageIndex * (this.pageSize + 1));
    // @ts-ignore
    const locations = batchPoints.map(p => p.geometry.coordinates.map(c => c.toFixed(6)).join(','));
    // restapi.amap.com/v3/geocode/regeo?key=您的key&location=116.481488,39.990464&poitype=商务写字楼&radius=1000&extensions=all&batch=true&roadlevel=0
    const url = `//restapi.amap.com/v3/geocode/regeo?key=e6b9cf56ff9d7ab84b52995cec6f621d&location=${locations.join('|')}&radius=1000&extensions=all&batch=true&roadlevel=0`;
    console.log('geocode url=>' + url);
    this.http.get(url).subscribe(res => {
      console.log(res);
      this.pageIndex++;
      if (this.pageIndex < this.pageCount) {
        setTimeout(this.loadAddresses, 300);
      }
    });
  }
}
