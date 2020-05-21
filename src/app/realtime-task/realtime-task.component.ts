import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskService} from '../../services/TaskService';
import {Task} from '../../model/Task';
import {AlertController} from '@ionic/angular';
import {TrackData} from '../../model/TrackData';

@Component({
  selector: 'app-realtime-task',
  templateUrl: './realtime-task.component.html',
  styleUrls: ['./realtime-task.component.scss'],
})
export class RealtimeTaskComponent implements OnInit {

  task: Task = { running: false, deviceId: null , startTime: new Date(), endTime: null};
  trackList: Array<TrackData> = [];
  _isBusy = false;
  _realtimeTrackTimer = null;

  get isBusy(){
    return this._isBusy;
  }

  @Output() onRealtimeDataChange = new EventEmitter<any>();
  @Output() onRealtimeTaskLoaded = new EventEmitter<any>();

  get actionText(){
    console.log('get action Text');
    return this.task.running === true ? '停止' : '启动';
  }



  get hasDevice(){
      return !!this.task.deviceId ? false : true;
  }

  get actionColor(){
    return this.task.running === true ? 'danger' : 'dark';
  }

  @Input()
  set deviceId(value: string) {
    this.task.deviceId = value;
    if (!!this._realtimeTrackTimer) {
      clearInterval(this._realtimeTrackTimer);
    }
    this.loadRealtimeTaskByDeviceId();
  }

  get deviceId(){
    return this.task.deviceId;
  }

  constructor(public taskService: TaskService, public alertCtrl: AlertController) {
  }
  ngOnInit() {}

  private trackRealtimeData() {
    this._realtimeTrackTimer = setInterval(() => {
      this.taskService.getRealtimeData(this.deviceId).subscribe(res => {
        const trackData: TrackData = res;
        if (!!trackData.lng && !!trackData.lat && trackData.lng > 0 && trackData.lat > 0)
        {
          this.onRealtimeDataChange.emit(res);
        }
      });
    }, 1000);
  }

  private loadRealtimeTaskByDeviceId() {
    if (this._isBusy === false && !!this.deviceId)
    {
      this._isBusy = true;
      this.taskService.loadRealtimeTask(this.deviceId).subscribe(res => {
        if (res.deviceId != null) {
          this.task = res;
          if (this.task.running) {
            this.taskService.loadTaskTrackData(this.task.taskId).subscribe(trackList => {
              this.trackList = trackList;
              if (this.onRealtimeTaskLoaded != null) {
                // @ts-ignore
                this.onRealtimeTaskLoaded.emit({task: this.task, trackData: this.trackList});
              }
              this.trackRealtimeData();
              this._isBusy = false;
            });
          }else{
            this.trackRealtimeData();
            this._isBusy = false;
          }
        }
      });
    }

  }

  public actionTask() {
    if (this.task.running) {
      this.stopTask();
    } else {
      this.startTask();
    }
  }

  public  startTask(){
      this.task.running = true;
  }

  public stopTask(){
    this.task.running = false;
  }

}
