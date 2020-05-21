import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TaskService} from '../../services/TaskService';
import {CsvUtil} from '../../utils/CsvUtil';
import {GeoUtil} from '../../utils/GeoUtil';
import {MapGridUtil} from '../../utils/MapGridUtil';
import {TrackData} from '../../model/TrackData';
import {LoadingController, ModalController} from '@ionic/angular';
import {HotPointsPage} from '../hot-points/hot-points.page';
declare var AMap;
@Component({
  selector: 'app-track-historia',
  templateUrl: './track-historia.page.html',
  styleUrls: ['./track-historia.page.scss'],
})
export class TrackHistoriaPage implements OnInit, AfterViewInit {

  @ViewChild('mapView') mapViewEl: ElementRef;
  map: any;
  showOptions = false;
  taskGrids = new Map();
  mTaskGridsVisible = true;
  mTaskPolylineVisible = true;
  currentTaskId;
  currentCarLocation = 0;
  currentData: TrackData;
  mPlayStatus = 0;
  csvUtil = new CsvUtil();
  geoUtil = new GeoUtil();

  constructor(public taskService: TaskService, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {


  }


  get taskGridsVisible() {
    return this.mTaskGridsVisible;
  }

  set taskGridsVisible(value) {
    this.mTaskGridsVisible = value;
    if (!!this.currentMapGrid) {
      if (value) {
        this.currentMapGrid.getOverlayPolygonGroup().show();
      } else {
        this.currentMapGrid.getOverlayPolygonGroup().hide();
      }
    }
  }

  get taskPathVisible() {
    return this.mTaskPolylineVisible;
  }

  set taskPathVisible(value) {
    this.mTaskPolylineVisible = value;
    if (!!this.currentMapGrid) {
      if (value) {

        this.currentMapGrid.getOverlayPolylineGroup().show();
      } else {
        this.currentMapGrid.getOverlayPolylineGroup().hide();
      }
    }
  }


  get trackPathLength() {
    const mapGrid: MapGridUtil = this.taskGrids.get(this.currentTaskId);
    return !!mapGrid ? mapGrid.trackPath.length : 0;
  }

  get currentMapGrid(): MapGridUtil {
    return this.taskGrids.get(this.currentTaskId);
  }

  public resumeAnimation() {
    this.currentMapGrid.marker.resumeMove();
    this.mPlayStatus = 1;
  }

  changeTrackPath(event) {
    if (this.currentCarLocation < this.currentMapGrid.trackPath.length - 1) {
      this.currentMapGrid.marker.stopMove();
      const pos = this.currentMapGrid.trackPath[this.currentCarLocation];
      this.map.setZoomAndCenter(18, pos);
      console.log(pos);
      this.currentMapGrid.marker.setPosition(pos);
      const path = this.currentMapGrid.trackPath.slice(this.currentCarLocation);
      this.currentMapGrid.marker.moveAlong(path, 200);
      this.mPlayStatus = 1;
    }
  }

  ngOnInit() {


  }




  async showHotPoints() {
    const modal = await this.modalCtrl.create({
      component: HotPointsPage,
      componentProps: { hotPoints: this.currentMapGrid.hotPoints }
    });
    return await modal.present();
  }

  startAnimation() {
    this.currentMapGrid.marker.moveAlong(this.currentMapGrid.trackPath, 200);
    this.mPlayStatus = 1;
  }

  pauseAnimation() {
    this.currentMapGrid.marker.pauseMove();
    this.mPlayStatus = 2;
  }

  stopAnimation() {
    this.currentMapGrid.marker.stopMove();
    this.mPlayStatus = 0;
  }

  onPathVisbileChange() {
    console.log('onPathVisbileChange');
  }

  searchRoundPOI(data){

  }

  showCalendar(){

  }

  ngAfterViewInit(): void {
    this.map = new AMap.Map(this.mapViewEl.nativeElement, {
      resizeEnable: true, // 是否监控地图容器尺寸变化
      zoom: 11, // 初始化地图层级
      center: [116.397428, 39.90923] // 初始化地图中心点
    });
    // this.map = new AMap.Map(this.mapViewEl.nativeElement, {
    //   resizeEnable: true,
    //   rotateEnable: true,
    //   pitchEnable: true,
    //   zoom: 17,
    //   pitch: 80,
    //   rotation: -15,
    //   viewMode: '3D', // 开启3D视图,默认为关闭
    //   buildingAnimation: true, // 楼块出现是否带动画
    //   expandZoomRange: true,
    //   zooms: [3, 20],
    //   center: [116.333926, 39.997245]
    // });
    this.currentTaskId = '03d0f032-3a07-4251-8043-96b6302581a0';
    this.taskService.loadTaskTrackCsvData(this.currentTaskId).subscribe(res => {
      const trackData = this.csvUtil.loadData(res);
      const features = this.geoUtil.toFeatureCollection(trackData);
      const bbox = turf.bbox(features);
      const mapGrid = new MapGridUtil(this.map, bbox, 'pm10', 0.03);
      mapGrid.loadData(features);
      mapGrid.marker.on('moving', (e) => {
        const pos = [mapGrid.marker.getPosition().getLng(), mapGrid.marker.getPosition().getLat()];
        const targetPoint = turf.point(pos, {'marker-color': '#0F0'});
        // @ts-ignore
        const nearest = turf.nearestPoint(targetPoint, mapGrid.features);
        this.currentData = nearest.properties;
      });
      this.taskGrids.set(this.currentTaskId, mapGrid);
    });
  }
}
