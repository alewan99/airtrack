import {Component, ElementRef, OnInit,  ViewChild, AfterViewInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CsvUtil} from '../../utils/CsvUtil';
import {MapGridUtil} from '../../utils/MapGridUtil';
import {AlertController, ModalController, PopoverController} from '@ionic/angular';
import {PollutionStdUtil} from '../../utils/PollutionStdUtil';
import {DeviceListPage} from '../device-list/device-list.page';

declare var AMap;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  constructor(public http: HttpClient, public csvUtil: CsvUtil, public alterCtrl: AlertController, public modalCtrl: ModalController) {
     this.pollutionStdUtil = new PollutionStdUtil();
  }

  get deviceText(){
      return !!this.deviceId ? this.deviceId : '(请选择设备)';
  }

  get pollutionText()
  {
      return !!this.pollution ? this.pollution : '暂无';
  }

    get footerMessage(){
        const messages = [];
        messages.push(`当前设备:${this.deviceText}`);
        messages.push(`当前污染物:${this.pollution}`);
        if (!!this.realtimeData) {
        messages.push(`最后更新时间:${this.realtimeData.time.toLocaleTimeString()}`);
        }
        return messages.join(',');
    }

  @ViewChild('mapView') mapViewEl: ElementRef;

  map;
  mapGrid;
  pollutionStdUtil;
  pollution = 'pm2_5';
  deviceId = null;
  realtimeData;
  task;
  trackData = [];

  async presentPollutions() {
      const pollution = this.pollutionStdUtil.getPollutions();
      const raioButtons = pollution.map((p) => {
          return {
              type: 'radio',
              label: p.label,
              value: p.code,
              name: p.code
          };
      });
      const alert = await this.alterCtrl.create({
          header: '选择污染物',
          inputs: raioButtons,
          buttons: [
              {
                  text: '取消',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: (value) => {
                  }
              }, {
                  text: '确定',
                  handler: (value) => {
                      this.pollution = value;
                      this.mapGrid.changePollution(this.pollution);
                  }
              }
          ]
      });
      await alert.present();
  }

  async  presentDeviceList() {
      const modal = await this.modalCtrl.create({
          component: DeviceListPage
      });
      modal.onWillDismiss().then(res => {
          if (this.deviceId !== res.data.deviceId)
          {
              this.deviceId = res.data.deviceId;
              this.changeDevice(this.deviceId);
          }
          console.log(res);
      });
      return await modal.present();
  }

    onRealtimeTaskLoaded(data)
    {
       console.log('onRealtimeTaskLoaded')
        this.task = data.task;
        this.trackData = data.trackData;
        if (this.trackData && this.trackData.length > 0)
        {
            const dataPoint = this.trackData[this.trackData.length - 1];
            this.map.setZoomAndCenter(13, [dataPoint.lng, dataPoint.lat]);
            this.mapGrid = new MapGridUtil(this.map, null, 'pm10', 0.05);
            this.mapGrid.renderDataPoints(this.trackData);
            this.mapGrid.getOverlayTextGroup().hide();
        }

    }

    onRealtimeDataChange(data) {
        console.log('onRealtimeDataChange')
        if (this.trackData.length <= 0) {
            // const dataPoint = dataPoints[dataPoints.length - 1];
            this.map.setZoomAndCenter(13, [data.lng, data.lat]);
            this.mapGrid = new MapGridUtil(this.map, null, 'pm10', 0.05);
            this.mapGrid.renderDataPoints([data]);
            this.mapGrid.getOverlayTextGroup().hide();
        }
        this.mapGrid.renderData(data);
    }

  ngAfterViewInit(){
      this.map = new AMap.Map(this.mapViewEl.nativeElement, {
      resizeEnable: true, // 是否监控地图容器尺寸变化
      zoom: 11, // 初始化地图层级
      center: [116.397428, 39.90923] // 初始化地图中心点
    });
      const that = this;
      this.map.on('zoomchange', (event, args) => {
      const zoomLevel = that.map.getZoom();
      console.log(zoomLevel);
      if (that.mapGrid)
      {
        if (zoomLevel < 16)
        {
          that.mapGrid.getOverlayTextGroup().hide();
        }else{
          that.mapGrid.getOverlayTextGroup().show();
        }
      }
    });
  }

  ngOnInit(): void {
  }

  changeDevice(deviceId){

  }
}
