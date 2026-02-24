//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM GPSCoords interface
//----------------------------------------------------------------------------------------------------------------------
import type { GPSCoords } from 'src/interface';
import type { Feature, GeoJsonProperties, LineString } from 'geojson';
//----------------------------------------------------------------------------------------------------------------------
//List of GPS events
//----------------------------------------------------------------------------------------------------------------------
import { DistanceUnits, GPSEvents } from 'src/enum';
//----------------------------------------------------------------------------------------------------------------------
//Imports from VUE
//----------------------------------------------------------------------------------------------------------------------
import { ref } from 'vue';
import type { Ref } from 'vue';
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM CLASS to get data from Server
//----------------------------------------------------------------------------------------------------------------------
import request from 'src/API/ajax';
//----------------------------------------------------------------------------------------------------------------------
//TURF geo package
//----------------------------------------------------------------------------------------------------------------------
import * as turf from '@turf/turf';
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM special formatters
//----------------------------------------------------------------------------------------------------------------------
import { secondsToHms } from 'src/helpers/formaters';
//----------------------------------------------------------------------------------------------------------------------
//Quasar prompt dialogs
//----------------------------------------------------------------------------------------------------------------------
import { usePrompt } from 'src/composables/usePrompt';
const prompt = usePrompt();
import { ModalsList, useDialogs } from 'src/composables/useDialogs';
const dialogs = useDialogs();
import { usePOIStore } from 'src/stores/poi';
import { useGPS } from 'src/composables/useGPS';
const gps = useGPS();
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM CLASS to handle GPS events and control GPS service on server
//----------------------------------------------------------------------------------------------------------------------
class MAPTORIUMGPS {
  private _lastCoords: GPSCoords = { lat: 0, lng: 0, dir: 0 };

  public _distanceToGo: number = 0;
  public _distanceRun: number = 0;
  public distanceRun: Ref<number> = ref(0);
  public leaveDistance: Ref<number> = ref(0);
  public _points: Array<GPSCoords> = [];
  public _callbacks: { [id: string]: CallableFunction } = {};
  public units: DistanceUnits = DistanceUnits.nmile;
  public untisKey: string = 'nmile';
  public _speedLog: Array<{ lat: number; lng: number; time: number }> = [];
  public speed: Ref<number> = ref(0);
  public dir: Ref<number> = ref(0);
  public time: Ref<string> = ref('');
  /**
   * Get current GPS from server and update
   */
  public async now(): Promise<void> {
    const data = (await request('gps.now', {}, 'get')) as false | GPSCoords;
    if (data) {
      this.set(data.lat, data.lng, data.dir);
    }
  }
  /**
   * Set current coords and fire update event
   * @param lat - Latitude
   * @param lng - Longitude
   * @param dir - Direction, optional
   */
  public set(lat: number, lng: number, dir?: number): void {
    if (lat !== 0 && lng !== 0) {
      this._lastCoords.lat = lat;
      this._lastCoords.lng = lng;
      if (dir) this.dir.value = Math.round(dir * 100) / 100;
      //Calculate avaregae speed by last 10 points
      let dist = 0;
      let time = 0;
      this._speedLog.push({ lat: lat, lng: lng, time: Math.floor(Date.now() / 1000) });
      if (this._speedLog.length > 2) {
        for (let i = 1; i < this._speedLog.length; i++) {
          const prevPoint = this._speedLog[i - 1];
          const currentPoint = this._speedLog[i];
          if (prevPoint && currentPoint) {
            dist += turf.distance(
              [prevPoint.lng, prevPoint.lat],
              [currentPoint.lng, currentPoint.lat],
              { units: 'meters' },
            );
            time += currentPoint.time - prevPoint.time;
          }
        }

        const speed = (dist / this.units / time) * 3600;

        if (speed > 0) {
          this.speed.value = Math.round(speed * 100) / 100;
          this.time.value = secondsToHms((this.leaveDistance.value / speed) * 3600);
        }

        if (!dir) {
          const prevPoint = this._speedLog[this._speedLog.length - 2];
          const currentPoint = this._speedLog[this._speedLog.length - 1];
          if (prevPoint && currentPoint) {
            this.dir.value =
              Math.round(
                turf.bearing([prevPoint.lat, prevPoint.lng], [currentPoint.lat, currentPoint.lng]) /
                  100,
              ) * 100;
          }
        }
      }
      //If more than 10 points in array - remove firs point
      if (this._speedLog.length > 100) this._speedLog.shift();
      if (dir) this._lastCoords.dir = dir;
      this._fire(GPSEvents.update, lat, lng, dir);
      if (gps.center.value) this._fire(GPSEvents.center, lat, lng);
      if (this._points.length > 2) {
        const lastPoint = this._points[this._points.length - 1];
        if (lastPoint) {
          const lastDistance = turf.distance([lastPoint.lng, lastPoint.lat], [lng, lat], {
            units: 'meters',
          });
          this.distanceRun.value =
            Math.round(((this._distanceRun + lastDistance) / this.units) * 100) / 100;
          //Calculate how much distance still need run
          this.leaveDistance.value = this._distanceToGo / this.units - this.distanceRun.value;
          if (this.leaveDistance.value < 0) this.leaveDistance.value = 0;
        }
      }
    }
  }
  /** Function to override geolocation in browser*/
  // overrideGeolocation(lat: number, lon: number, dir: number, speed: number) {
  //   //Override standart geolocation function in browser
  //   navigator.geolocation.getCurrentPosition = function (success) {
  //     const position = {
  //       coords: {
  //         latitude: lat,
  //         longitude: lon,
  //         heading: dir,
  //         altitude: 0,
  //         accuracy: 10,
  //         altitudeAccuracy: 10,
  //         speed: speed,
  //         toJSON: (): unknown => ({}),
  //       },
  //       timestamp: Date.now(),
  //       toJSON: (): any => ({}),
  //     };
  //     success(position);
  //   };

  //   //Override standart position watch function in browser
  //   navigator.geolocation.watchPosition = function (success: PositionCallback) {
  //     const position = {
  //       coords: {
  //         latitude: lat,
  //         longitude: lon,
  //         heading: dir,
  //         altitude: 0,
  //         accuracy: 10,
  //         altitudeAccuracy: 10,
  //         speed: speed,
  //         toJSON: (): any => ({}),
  //       },
  //       timestamp: Date.now(),
  //       toJSON: (): any => ({}),
  //     };
  //     success(position);
  //   };
  // }
  /**
   * Set units coeficient to convert distance
   */
  setUnits(units: keyof typeof DistanceUnits) {
    this.units = DistanceUnits[units];
    this.untisKey = units;
  }
  /**
   * Start server GPS service
   */
  public async start(): Promise<void> {
    if (await request<boolean>('gps.start', {}, 'get', true)) gps.run.value = true;
    else gps.run.value = false;
  }

  /**
   * Stop server GPS service
   */
  public async stop(): Promise<void> {
    if (await request<boolean>('gps.stop', {}, 'get', true)) {
      gps.run.value = false;
    }
  }
  /**
   * Toggle record GPS route
   */
  public async toggleRecord(): Promise<void> {
    if (gps.record.value) {
      if (await request<boolean>('gps.stoprecord', {}, 'get', true)) gps.record.value = false;
    } else {
      if (await request<boolean>('gps.startrecord', {}, 'get', true)) gps.record.value = true;
    }
  }
  /**
   * Toggle server GPS service
   */
  public async toggle(): Promise<void> {
    if (gps.run.value) await this.stop();
    else await this.start();
  }
  /**
   * Set sample time for GPS service
   * */
  public async SampleTime() {
    //Show input modal and get value from
    const time = (await prompt('menu.gps.route.sample_time', 'txt.gps.sample_time')) as
      | false
      | string;
    //If value, send request
    if (time) await request<boolean>('gps.sample', { time: time }, 'post', true);
  }

  public async New(): Promise<void> {
    const name = (await prompt(
      'dialog.gps.route_new_name.title',
      'dialog.gps.route_new_name.descr',
    )) as false | string;
    if (name) {
      await request<boolean>('gps.routenew', { name: name }, 'post', true);
    }
  }

  private _parseRouteCoordsFromFileContent(data: string): Array<[number, number]> {
    const lines = data
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('//'));

    const points: Array<[number, number]> = [];

    for (let i = 0; i < lines.length; i++) {
      const coord = lines[i]?.split(',').map((value) => value.trim()) ?? [];
      if (coord.length < 7) continue;

      const latDeg = Number.parseInt(coord[1] ?? '', 10);
      const latMin = Number.parseFloat(coord[2] ?? '');
      const latHemisphere = coord[3] ?? '';

      const lngDeg = Number.parseInt(coord[4] ?? '', 10);
      const lngMin = Number.parseFloat(coord[5] ?? '');
      const lngHemisphere = coord[6] ?? '';

      if (
        Number.isNaN(latDeg) ||
        Number.isNaN(latMin) ||
        Number.isNaN(lngDeg) ||
        Number.isNaN(lngMin)
      ) {
        continue;
      }

      let lat = latDeg + latMin / 60;
      let lng = lngDeg + lngMin / 60;

      if (latHemisphere === 'S') lat = -lat;
      if (lngHemisphere === 'W') lng = -lng;

      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        points.push([lng, lat]);
      }
    }

    return points;
  }

  /** Read route from file and display on map */
  public async routeFromFileModal() {
    const routeFile = (await dialogs(ModalsList.GPSRouteFromFile)) as false | File;
    if (!routeFile) return;

    const data = await routeFile.text();
    if (!data) return;

    const routePoints = this._parseRouteCoordsFromFileContent(data);
    if (routePoints.length < 2) return;

    const poiStore = usePOIStore();
    const routeName = poiStore.nextRouteName();
    const feature: Feature<LineString, GeoJsonProperties> = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: routePoints,
      },
      properties: {
        name: routeName,
        folderID: null,
      },
    };

    poiStore.addDrawing(feature);
  }
  /**
   * SET distance to go for time calculation
   */
  public async distanceToGoModal() {
    const data = (await dialogs(ModalsList.DistanceToGO, {
      distance: this._distanceToGo,
    })) as
      | false
      | {
          distance: number;
          units: keyof typeof DistanceUnits;
        };
    if (data) {
      if (
        await request<boolean>(
          'core.default',
          { distanceToGo: data.distance, units: data.units },
          'post',
          true,
        )
      ) {
        this.distanceToGo(data.distance, data.units);
      }
    }
    return this._distanceToGo;
  }

  public distanceToGo(distance: number, units: keyof typeof DistanceUnits = 'nmile') {
    this.units = DistanceUnits[units];
    this._distanceToGo = distance * this.units;
    this.untisKey = units;
  }

  public async GPSConfigModal() {
    const data = (await dialogs(ModalsList.GPSConfig)) as
      | false
      | {
          host: string;
          port: number;
          type: string;
          device: string;
        };
    if (data && data.host && data.port) {
      await request<boolean>('core.default', { gpsServer: data }, 'post', true);
    }
  }
  /**
   * Calculate run distance using GPS points
   * @param points - GPS coords array
   */
  public Points(points: Array<GPSCoords> | false) {
    if (points) {
      this._points = points;
      this._distanceRun = 0;
      for (let i = 1; i < this._points.length; i++) {
        const prevPoint = this._points[i - 1];
        const currentPoint = this._points[i];
        if (prevPoint && currentPoint) {
          this._distanceRun +=
            Math.floor(
              turf.distance([prevPoint.lng, prevPoint.lat], [currentPoint.lng, currentPoint.lat], {
                units: 'meters',
              }) * 100,
            ) / 100;
        }
      }
      this.distanceRun.value = Math.round((this._distanceRun / this.units) * 100) / 100;
    }
  }

  public RoutePoint(lat: number, lng: number) {
    this._points.push({ lat, lng, dir: 0 });
    if (this._points.length > 1) {
      const length = this._points.length - 1;
      const prevPoint = this._points[length - 1];
      const currentPoint = this._points[length];
      if (prevPoint && currentPoint) {
        this._distanceRun += turf.distance(
          [prevPoint.lng, prevPoint.lat],
          [currentPoint.lng, currentPoint.lat],
          { units: 'meters' },
        );
        this.distanceRun.value = Math.round((this._distanceRun / this.units) * 100) / 100;
      }
    }
  }

  public get lastCoords() {
    return this._lastCoords;
  }

  public async deviceList() {}

  public on(event: GPSEvents, callback: CallableFunction) {
    if (callback) {
      this._callbacks[event] = callback;
    }
  }

  public _fire(
    event: GPSEvents,
    data1?: unknown,
    data2?: unknown,
    data3?: unknown,
    data4?: unknown,
  ) {
    if (this._callbacks[event]) {
      this._callbacks[event](data1, data2, data3, data4);
    }
  }
}
//----------------------------------------------------------------------------------------------------------------------
//INIT new MAPTORIUM GPS class
//----------------------------------------------------------------------------------------------------------------------
const GPS = new MAPTORIUMGPS();
//----------------------------------------------------------------------------------------------------------------------
//EXPORT new MAPTORIUM GPS class
//----------------------------------------------------------------------------------------------------------------------
export default GPS;
//----------------------------------------------------------------------------------------------------------------------
//SOCKET.IO for realtime comunication
//----------------------------------------------------------------------------------------------------------------------
import socket from 'src/API/Socket';
//----------------------------------------------------------------------------------------------------------------------
//SOCKET.IO new GPS coords event
//----------------------------------------------------------------------------------------------------------------------
socket.on('gps.now', (data: { lat: number; lng: number; dir?: number }) => {
  //Update coords and fire event
  GPS.set(data.lat, data.lng, data.dir);
});
//----------------------------------------------------------------------------------------------------------------------
//SOCKET.IO new GPS route point update event
//----------------------------------------------------------------------------------------------------------------------
socket.on('gps.routepoint', (data: { lat: number; lng: number }) => {
  GPS.RoutePoint(data.lat, data.lng);
});
