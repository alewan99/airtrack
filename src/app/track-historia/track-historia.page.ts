import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TaskService} from '../../services/TaskService';
import {CsvUtil} from '../../utils/CsvUtil';
import {GeoUtil} from '../../utils/GeoUtil';
import {MapGridUtil} from '../../utils/MapGridUtil';
declare var AMap;
@Component({
  selector: 'app-track-historia',
  templateUrl: './track-historia.page.html',
  styleUrls: ['./track-historia.page.scss'],
})
export class TrackHistoriaPage implements OnInit, AfterViewInit {

  @ViewChild('mapView') mapViewEl: ElementRef;
  map: any;
  constructor(public taskService: TaskService) {



  }

  csvUtil = new CsvUtil();
  geoUtil = new GeoUtil();
  showOptions = false;
  taskGrids = new Map();
  mTaskGridsVisible = true;
  mTaskPolylineVisible = false;
  currentTaskId;
  currentLocation = 0;

  get taskGridsVisible(){
    return this.mTaskGridsVisible;
  }

  set taskGridsVisible(value) {
    this.mTaskGridsVisible = value;
  }

  get taskPathVisible() {
    return this.mTaskPolylineVisible;
  }

  set taskPathVisible(value) {
    this.mTaskPolylineVisible = value;
  }


  get trackPathLength() {
    const mapGrid: MapGridUtil = this.taskGrids.get(this.currentTaskId);
    return !!mapGrid ? mapGrid.trackPath.length : 0;
  }

  get currentMapGrid(): MapGridUtil {
    return this.taskGrids.get(this.currentTaskId);
  }

  changeTrackPath() {
    const pos = this.currentMapGrid.trackPath[this.currentLocation];
    this.currentMapGrid.marker.setPosition(pos);
  }

  ngOnInit() {


  }



  startAnimation() {
    this.taskGrids.get(this.currentTaskId).startAnimation();
  }

  pauseAnimation() {
    this.taskGrids.get(this.currentTaskId).pauseAnimation();
  }

  stopAnimation() {
    this.taskGrids.get(this.currentTaskId).stopAnimation();
  }

  onPathVisbileChange(){
    console.log('onPathVisbileChange');
  }

  ngAfterViewInit(): void {
    this.map = new AMap.Map(this.mapViewEl.nativeElement, {
      resizeEnable: true, // 是否监控地图容器尺寸变化
      zoom: 11, // 初始化地图层级
      center: [116.397428, 39.90923] // 初始化地图中心点
    });
    this.currentTaskId = '05c9aa69-ace0-4153-8704-de9a0b641b78';
    this.taskService.loadTaskTrackCsvData(this.currentTaskId).subscribe(res => {
      const trackData =  this.csvUtil.loadData(res);
      const features = this.geoUtil.toFeatureCollection(trackData);
      const bbox = turf.bbox(features);
      const mapGrid = new MapGridUtil (this.map, bbox, 'pm10', 0.03);
      mapGrid.loadData(features);
      this.taskGrids.set(this.currentTaskId, mapGrid);
    });
  }
}
