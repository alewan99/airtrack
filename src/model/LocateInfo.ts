export class LocateInfo {
    /**
     * 经度
     */
    longitude: number;
    /**
     * 维度
     */
    latitude: number;
    /**
     * 是否在中国
     */
    mIsChina: boolean;

    public setChina(value) {
        this.mIsChina = value;
    }

    public setLatitude(lat) {
        this.latitude = lat;
    }

    public setLongitude(lon) {
        this.longitude = lon;
    }

    public isChina() {
        return this.mIsChina;
    }

    public getLatitude() {
        return this.latitude;
    }

    public getLongitude() {
        return this.longitude;
    }
}
