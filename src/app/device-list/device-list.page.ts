import { Component, OnInit } from '@angular/core';
import {DeviceService} from '../../services/DeviceService';
import {Device} from '../../model/Device';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.page.html',
  styleUrls: ['./device-list.page.scss'],
})
export class DeviceListPage implements OnInit {

  deviceList: Array<Device> = [];

  constructor(public deviceService: DeviceService, public modalCtrl: ModalController) { }

  ngOnInit() {

      this.deviceService.list().subscribe(res  => {
         this.deviceList = res;
      });
  }

  public dismissAndCheckDevice(item)
  {
      this.modalCtrl.dismiss(item);
  }

}
