import {LocateInfo} from '../model/LocateInfo';

export class Gcj02wgs84Util {

    pi = 3.1415926535897932384626; // 圆周率
    a = 6378245.0; // 克拉索夫斯基椭球参数长半轴a
    ee = 0.00669342162296594323; // 克拉索夫斯基椭球参数第一偏心率平方
    // 从GPS转高德
    public wgs84_To_Gcj02(lat, lon) {

        const info = new LocateInfo();
        if (this.isOutOfChina(lat, lon)) {
            info.setChina(false);
            info.setLatitude(lat);
            info.setLongitude(lon);
        } else {
            let dLat = this.transformLat(lon - 105.0, lat - 35.0);
            let dLon = this.transformLon(lon - 105.0, lat - 35.0);
            const radLat = lat / 180.0 * this.pi;
            let magic = Math.sin(radLat);
            magic = 1 - this.ee * magic * magic;
            const sqrtMagic = Math.sqrt(magic);
            dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.pi);
            dLon = (dLon * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * this.pi);
            const mgLat = lat + dLat;
            const mgLon = lon + dLon;
            info.setChina(true);
            info.setLatitude(mgLat);
            info.setLongitude(mgLon);
        }
        return info;
    }

    // 从高德转到GPS
    public gcj02_To_Wgs84(lat, lon) {
        const info = new LocateInfo();
        const gps = this.transform(lat, lon);
        const lontitude = lon * 2 - gps.getLongitude();
        const latitude = lat * 2 - gps.getLatitude();
        info.setChina(gps.isChina());
        info.setLatitude(latitude);
        info.setLongitude(lontitude);
        return info;
    }

    // 判断坐标是否在国外
    private isOutOfChina(lat, lon) {
        if (lon < 72.004 || lon > 137.8347) {
            return true;
        }
        if (lat < 0.8293 || lat > 55.8271) {
            return true;
        }
        return false;
    }

    // 转换
    private transform(lat, lon) {
        const info = new LocateInfo();
        if (this.isOutOfChina(lat, lon)) {
            info.setChina(false);
            info.setLatitude(lat);
            info.setLongitude(lon);
            return info;
        }
        let dLat = this.transformLat(lon - 105.0, lat - 35.0);
        let dLon = this.transformLon(lon - 105.0, lat - 35.0);
        const radLat = lat / 180.0 * this.pi;
        let magic = Math.sin(radLat);
        magic = 1 - this.ee * magic * magic;
        const sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.pi);
        dLon = (dLon * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * this.pi);
        const mgLat = lat + dLat;
        const mgLon = lon + dLon;
        info.setChina(true);
        info.setLatitude(mgLat);
        info.setLongitude(mgLon);
        return info;
    }

    // 转换纬度所需
    private transformLat(x, y) {
        let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y
            + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.pi) + 20.0 * Math.sin(2.0 * x * this.pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * this.pi) + 40.0 * Math.sin(y / 3.0 * this.pi)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * this.pi) + 320 * Math.sin(y * this.pi / 30.0)) * 2.0 / 3.0;
        return ret;
    }

    // 转换经度所需
    private transformLon(x, y) {
        let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1
            * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.pi) + 20.0 * Math.sin(2.0 * x * this.pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * this.pi) + 40.0 * Math.sin(x / 3.0 * this.pi)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * this.pi) + 300.0 * Math.sin(x / 30.0 * this.pi)) * 2.0 / 3.0;
        return ret;
    }

}
