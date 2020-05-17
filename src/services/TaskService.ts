import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';
import {Task} from '../model/Task';
import {TrackData} from '../model/TrackData';


export  interface TrackDataV2 {
    ID?: any;
    MonitoringTime?: any;
    Latitude?: any;
    Longitude?: any;
    NO2?: any;
    CO?: any;
    O3?: any;
    SO2?: any;
    PM1?: any;
    PM2_5?: any;
    PM10?: any;
    temp?: any;
    Humi?: any;
    Flog?: any;
    VOC?: any;
}

@Injectable()
export class TaskService {


    constructor(public http: HttpClient)
    {

    }

    loadRealtimeTask(deviceId: any): Observable<Task> {
        // createTime: "2020-05-15T11:42:19.287"
        // deviceId: "9203H190600026"
        // endTime: null
        // running: true
        // startTime: "2020-05-15T11:42:19"
        // taskContent: ""
        // taskId: "5bac78e8-c0e4-4f5a-8a0d-82fb314974f7"
        // taskName: "任务-05-15-11"
        const url = `${environment.domain}/Api/task/runtimeTask?deviceId=${deviceId}`;
        return this.http.get<Task>(url);
    }

    loadTaskTrackData(taskId: string): Observable<Array<TrackData>>  {
        const url = `${environment.domain}/Api/task/taskTrackData?taskId=${taskId}`;
        return this.http.get<Array<TrackData>>(url);
    }

    loadTaskTrackCsvData(taskId: string): Observable<Array<TrackData>>  {
        const options = {responseType: 'text'};
        const url = `${environment.domain}/Api/task/loadCSVData?taskId=${taskId}`;
        // @ts-ignore
        return this.http.get<Array<TrackData>>(url, options);
    }

    getRealtimeData(deviceId: string): Observable<TrackData> {
        const url = `${environment.domain}/Api/task/realtime?deviceId=${deviceId}`;
        return this.http.get<TrackData>(url);
    }
}
