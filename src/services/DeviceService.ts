import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpUtil} from '../utils/HttpUtil';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Device} from '../model/Device';
@Injectable()
export class DeviceService {

    constructor(public http: HttpClient) {

    }
    public list(): Observable<Array<Device>> {
        const url = `${environment.domain}/Api/Vehicle/DeviceList`;
        console.log(url);
        // @ts-ignore
        return this.http.get(url);
    }
}
