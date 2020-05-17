import * as turf from 'turf';
import {TrackData} from '../model/TrackData';
import {Gcj02wgs84Util} from './Gcj02wgs84Util';

export class GeoUtil {
    private cgj02Wgs84Util = new Gcj02wgs84Util();
    constructor(){

    }

    toPoint(trackData: TrackData) {
        const coord = this.cgj02Wgs84Util.wgs84_To_Gcj02(parseFloat(trackData.lat.toString()), parseFloat(trackData.lng.toString()));
        trackData.lng = coord.getLongitude();
        trackData.lat = coord.getLatitude();
        return turf.point([trackData.lng, trackData.lat], trackData);
    }

    toFeatureCollection(trackData: Array<TrackData>) {
        const features = trackData.map(p => this.toPoint(p));
        return turf.featureCollection(features);
    }

    // toGrid(trackData: Array<TrackData>) {
    //
    //     const features = this.toFeatureCollection(trackData);
    //     const options = {gridType: 'square', property: 'solRad', units: 'miles'};
    //     let grid: any;
    //     grid = turf.interpolate(features, 50, options);
    //     return grid;
    // }

}
