import {PollutionStdUtil} from './PollutionStdUtil';
import {GeoUtil} from './GeoUtil';
import {Feature, FeatureCollection} from 'geojson';
import {EventEmitter} from '@angular/core';
// import * as turf from 'turf';
declare var AMap;
export  class MapGridUtil {

    constructor(map, bbox, pollution = 'pm10', cellSize = 0.05) {
        // console.log(bbox);
        this.map = map;
        this.overlayTextGroup = new AMap.OverlayGroup();
        this.overlayPolygonGroup = new AMap.OverlayGroup();
        this.overlayPolylineGroup = new AMap.OverlayGroup();
        this.overlayPolygonGroup.setMap(this.map);
        this.overlayTextGroup.setMap(this.map);
        this.overlayPolylineGroup.setMap(this.map);
        this.overlayTextGroup.hide();

        this.overlayAlarmGroup = new AMap.OverlayGroup();
        this.overlayAlarmGroup.setMap(this.map);

        if (!bbox) {
            const bounds = this.map.getBounds();
            // northeast: c {Q: 37.114156544824844, R: 114.6097491332888, lng: 114.609749, lat: 37.114157}
            // southwest: c {Q: 37.0092271715159, R: 114.49937086790794, lng: 114.499371, lat: 37.009227}
            // @ts-ignore
            const southEast = bounds.southwest;
            // @ts-ignore
            const northEast = bounds.northeast;
            bbox = [southEast.getLng(), southEast.getLat(), northEast.getLng(), northEast.getLat()];
        }
        this.bbox = bbox;
        this.gridCellSize = cellSize;
        // this.gridData = this.generateGrid(bbox, cellSize);
        this.map.on('zoomchange', (event, args) => {
            const zoomLevel = this.map.getZoom();
            if (zoomLevel > 16) {

                this.getOverlayTextGroup().show();
            } else {

                this.getOverlayTextGroup().hide();
            }

            if (zoomLevel > 12) {
                this.getOverlayAlarmGroup().show();
            } else {
                this.getOverlayAlarmGroup().hide();
            }
        });
        this.marker = new AMap.Marker({
            map: this.map,
            icon: 'https://webapi.amap.com/images/car.png',
            offset: new AMap.Pixel(-26, -13),
            autoRotation: true,
            angle: -90,
        });
    }

    bbox;
    center;
    sortFeatures;
    gridMap = new Map();
    overlayPolygonGroup;
    overlayTextGroup;
    overlayPolylineGroup;
    overlayAlarmGroup;
    map;
    pollution = 'pm10';
    pollutionStdUtil = new PollutionStdUtil();
    gridData;
    dataPoints;
    pageIndex = 0;
    isBusy = false;
    pageSize = 200;
    pageCount = 0;
    geoUtil = new GeoUtil();
    features;
    trackPath;
    taskPolyline;
    gridCellSize = 0.05;
    marker;
    startMarker;
    endMaker;
    hotPoints = [];

    alaramSegments = [];

    private static sortByTime(p1: Feature, p2: Feature) {
        return p1.properties.time > p2.properties.time ? -1 : 1;
    }

    getOverlayAlarmGroup() {
        return this.overlayAlarmGroup;
    }

    generateAlarmSegments() {
        const alarmFeatures = this.sortFeatures.filter(p =>
            p.properties[this.pollution] >
            this.pollutionStdUtil.alarmValues[this.pollution])
            .sort(MapGridUtil.sortByTime);

        let hasNextInSegments = false;
        let startSegmentIndex = this.sortFeatures.indexOf(alarmFeatures[0]);
        for (let i = 1; i < alarmFeatures.length; i++) {
            const pre = alarmFeatures[i - 1];
            const next = alarmFeatures[i];
            // const options = {units: 'miles'};
            // const distance = turf.distance(pre, next, options);
            const start = new Date(pre.properties.time).getTime();
            const end = new Date(next.properties.time).getTime();
            const timespan = Math.abs(end - start) / 1000 / 60;
            // 如果1分钟之内有连续报警则识别为同一个报警线段
            if (timespan < 1) {
                hasNextInSegments = true;
            } else {
                const startIndex = startSegmentIndex;
                const endIndex = this.sortFeatures.indexOf(pre);
                const segment = this.sortFeatures.slice(startIndex, endIndex).map(p => p.geometry.coordinates);
                const linestring1 = turf.lineString(segment, {name: 'line 1'});
                const alarmPath = new AMap.Polyline({
                    map: this.map,
                    path: segment,            // 设置线覆盖物路径
                    showDir: false,
                    strokeColor: '#ff7443',   // 线颜色
                    strokeWeight: 5,           // 线宽
                    zIndex: 375,
                    extData: segment
                });
                startSegmentIndex = this.sortFeatures.indexOf(next);
                hasNextInSegments = false;
            }
        }
    }

    // hotPoints = [];
    onCellClick = (e) => console.log(e);
    onPathClick = (e) => console.log(e);


    /**
     * 获取突高报警点
     */
    loadHotPoints() {
        setTimeout(
            () => {
                const features = this.sortFeatures.filter(p =>
                    parseFloat(p.properties[this.pollution].toString()) >
                    this.pollutionStdUtil.alarmValues[this.pollution]);
                const hotPoints = [];
                const newFeatures = features.sort((p1, p2) => {
                    return p1.properties.time > p2.properties.time ? -1 : 1;
                });
                let pushHotPoints = true;
                for (let i = 0; i < newFeatures.length - 1; i++) {
                    if (pushHotPoints) {
                        const alterMarker = new AMap.Marker({
                            // map: this.map,
                            position: newFeatures[i].geometry.coordinates,
                            // offset: new AMap.Pixel(-10, -10),
                            // icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
                            icon: 'assets/icon/alarm.png',
                            title: '报警点',
                            extData: newFeatures[i]
                        });
                        this.hotPoints.push(newFeatures[i]);
                        this.overlayAlarmGroup.addOverlay(alterMarker);
                    }
                    const options = {units: 'miles'};
                    // @ts-ignore
                    const distance = turf.distance(newFeatures[i], newFeatures[i + 1], options);
                    const start = new Date(newFeatures[i].properties.time).getTime();
                    const end = new Date(newFeatures[i + 1].properties.time).getTime();
                    const timespan = Math.abs(end - start);
                    console.log('distince=>' + distance + ';timespan=>' + timespan + ';value=>'
                        + newFeatures[i].properties[this.pollution]
                        + ';std value=>' + this.pollutionStdUtil.alarmValues[this.pollution]);

                    const total = timespan / 1000;
                   // 最近一分钟不列入计算
                    if (distance > 0.03 && total > 60) {
                        pushHotPoints = true;
                    } else {
                        pushHotPoints = false;
                    }
                }
                this.hotPoints.concat(hotPoints);
            }, 1000
        );
    }

    public getOverlayTextGroup() {
        return this.overlayTextGroup;
    }

    public changePollution(pollution) {
        this.pollution = pollution;
        this.overlayTextGroup.clearOverlays();
        this.overlayTextGroup.clearOverlays();
        this.gridMap.clear();
        this.renderDataPoints(this.dataPoints);
    }


    public getOverlayPolygonGroup() {
        return this.overlayPolygonGroup;
    }

    private generateGrid(bbox, cellSide: number = 0.05) {

        // const cellSide = 0.05;
        // @ts-ignore
        const squareGrid = turf.squareGrid(bbox, cellSide, {units: 'miles'});
        const cell = squareGrid.features[0].geometry.coordinates;
        const dx = Math.abs(cell[0][0][0] - cell[0][2][0]);
        const dy = Math.abs(cell[0][0][1] - cell[0][1][1]);
        const width = Math.abs(bbox[0] - bbox[2]);
        const height = Math.abs(bbox[1] - bbox[3]);
        const cols = parseInt((Math.round(width / dx)).toString(), 0);
        const rows = Math.floor(squareGrid.features.length / cols);
        const data = {width, height, cols, rows, dx, dy, cells: cols * rows, extent: bbox, grid: squareGrid};
        return data;
    }


    public renderData(dataPoint) {
        const dx2 = dataPoint.lng - this.gridData.extent[0];
        const dy2 = dataPoint.lat - this.gridData.extent[1];
        const colIndex = dx2 / this.gridData.dx;
        const rowIndex = dy2 / this.gridData.dy;
        // @ts-ignore
        const gridIndex = parseInt(colIndex.toString(), 0) * this.gridData.rows + parseInt(rowIndex.toString(), 0);
        if (!this.gridMap.has(gridIndex) && gridIndex < this.gridData.cells) {
            const color = this.pollutionStdUtil.getPollutionColor(this.pollution, dataPoint[this.pollution]);
            const polygon2 = new AMap.Polygon({
                fillColor: color,
                fillOpacity: .75,
                strokeColor: color,
                strokeWeight: 1,
                path: this.gridData.grid.features[gridIndex].geometry.coordinates,
                extData: dataPoint,
                draggable: false
            });
            polygon2.on('click', (e) => this.onCellClick(e));
            const coords = this.gridData.grid.features[gridIndex].geometry.coordinates[0];
            const w = Math.abs(coords[0].lng - coords[3].lng);
            const h = Math.abs(coords[0].lat - coords[1].lat);
            const pos: number[] = [coords[0].lng + w / 2, coords[0].lat + h / 2];
            const label = parseFloat(dataPoint[this.pollution]).toFixed(2);
            const text = new AMap.Text({
                text: label,
                anchor: 'center', // 设置文本标记锚点
                style: {
                    'background-color': 'transparent',
                    'border-width': 0
                },
                // @ts-ignore
                position: pos,
                extData: dataPoint,
                zIndex: 999
            });
            this.overlayPolygonGroup.addOverlay(polygon2);
            this.overlayTextGroup.addOverlay(text);
            this.gridMap.set(gridIndex, dataPoint);
        }
    }

    private renderBlockPoints() {
        if (this.pageIndex < this.pageCount && !this.isBusy) {
            this.isBusy = true;
            setTimeout(() => {
                const points =
                    this.pageIndex === this.pageCount - 1 ?
                        this.dataPoints.splice(this.pageIndex * this.pageSize) :
                        this.dataPoints.splice(this.pageIndex * this.pageSize, this.pageSize);
                points.forEach(dataPoint => {
                    this.renderData(dataPoint);
                });
                this.pageIndex++;
                this.isBusy = false;
                this.renderBlockPoints();

            }, 300);
        }
    }

    /**
     * 呈现网格点
     * @param dataPoints 网格点
     */
    public renderDataPoints(dataPoints) {
        dataPoints.forEach(dataPoint => {
            this.renderData(dataPoint);
        });
    }

    public loadData(features: FeatureCollection) {
        // this.features = this.geoUtil.toFeatureCollection(dataPoints);
        this.features = features;
        this.sortFeatures = this.features.features.sort(MapGridUtil.sortByTime);
        this.gridData = this.generateGrid(this.bbox, this.gridCellSize);
        this.dataPoints = this.sortFeatures.map(p => p.properties);
        this.trackPath = this.sortFeatures.map(p => p.geometry.coordinates);
        const nPageCount = parseInt((this.dataPoints.length / this.pageSize).toString(), 0);
        this.pageCount = this.dataPoints.length % this.pageSize === 0 ? nPageCount : nPageCount + 1;
        this.pageIndex = 0;
        this.bbox = turf.bbox(this.features);
        this.center = turf.center(this.features);
        this.map.setZoomAndCenter(12, this.center.geometry.coordinates);
        this.taskPolyline = new AMap.Polyline({
            map: this.map,
            path: this.trackPath,            // 设置线覆盖物路径
            showDir: true,
            strokeColor: '#3366bb',   // 线颜色
            strokeWeight: 10,           // 线宽
            zIndex: 300
        });

        this.startMarker = new AMap.Marker({
            map: this.map,
            position: this.sortFeatures[0].geometry.coordinates,
            // offset: new AMap.Pixel(-10, -10),
            // icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
            icon: 'assets/icon/qidian.png',
            title: '起点'
        });

        this.startMarker = new AMap.Marker({
            map: this.map,
            position: this.sortFeatures[this.sortFeatures.length - 1].geometry.coordinates,
            // offset: new AMap.Pixel(-10, -10),
            // icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
            icon: 'assets/icon/zhongdian.png',
            title: '终点'
        });


        this.renderDataPoints(this.dataPoints);
        // this.generateTrackPath();
        this.getOverlayTextGroup().hide();
        this.loadHotPoints();
        this.generateAlarmSegments();
    }


    public getOverlayPolylineGroup() {
        return this.overlayPolylineGroup;
    }

    /**
     *  生成跟踪路线
     */
    private generateTrackPath() {
        if (this.pageIndex < this.pageCount && !this.isBusy) {
            this.isBusy = true;
            setTimeout(() => {
                const points =
                    this.pageIndex === this.pageCount - 1 ?
                        this.sortFeatures.slice(this.pageIndex * this.pageSize) :
                        this.sortFeatures.slice(this.pageIndex * this.pageSize, this.pageSize * (this.pageIndex + 1));
                for (let i = 1; i < points.length; i++) {
                    // console.log(this.sortFeatures[i - 1].properties.time - this.sortFeatures[i].properties.time)
                    const distance = turf.distance(points[i - 1], points[i]);
                    if (distance === 0) {
                        continue;
                    }
                    if (distance > 0.1) {
                        continue;
                    }
                    const trackPath = new AMap.Polyline({
                        map: this.map,
                        path: [points[i - 1].geometry.coordinates, points[i].geometry.coordinates
                        ],            // 设置线覆盖物路径
                        showDir: false,
                        strokeColor: this.pollutionStdUtil.getPollutionColor(this.pollution,
                            points[i].properties[this.pollution]),   // 线颜色
                        strokeWeight: 5,           // 线宽
                        zIndex: 375,
                        extData: points[i - 1]
                    });
                    trackPath.on('click', this.onPathClick);
                    this.overlayPolylineGroup.addOverlay(trackPath);
                }

                this.pageIndex++;
                this.isBusy = false;
                this.generateTrackPath();
                // this.loadHotPoints();
            }, 500);
        }
    }
}
