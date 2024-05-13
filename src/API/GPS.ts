//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM GPSCoords interface
//----------------------------------------------------------------------------------------------------------------------
import type { GPSCoords } from '@/interface'
//----------------------------------------------------------------------------------------------------------------------
//List of GPS events
//----------------------------------------------------------------------------------------------------------------------
import { DistanceUnits, GPSEvents } from '@/enum'
//----------------------------------------------------------------------------------------------------------------------
//Imports from VUE
//----------------------------------------------------------------------------------------------------------------------
import { ref } from 'vue'
import type { Ref } from 'vue'
//----------------------------------------------------------------------------------------------------------------------
//SWAL Modal window for ONE TXT input
//----------------------------------------------------------------------------------------------------------------------
import inputModal from '@/API/Swal'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM CLASS to get data from Server
//----------------------------------------------------------------------------------------------------------------------
import request from '@/API/ajax'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM CLASS to handle Language support
//----------------------------------------------------------------------------------------------------------------------
import Lang from '@/lang/index'
//----------------------------------------------------------------------------------------------------------------------
//TURF geo package
//----------------------------------------------------------------------------------------------------------------------
import * as turf from '@turf/turf'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM special formatters
//----------------------------------------------------------------------------------------------------------------------
import { secondsToHms } from '@/helpers/formaters'
import inputModalNew, { ModalsList } from '@/API/Modals'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM CLASS to handle GPS events and control GPS service on server
//----------------------------------------------------------------------------------------------------------------------
class MAPTORIUMGPS {
  private _lastCoords: GPSCoords = { lat: 0, lng: 0, dir: 0 }
  public readonly run: Ref<boolean> = ref(false)
  public readonly record: Ref<boolean> = ref(false)
  public center: Ref<boolean> = ref(false)
  public _distanceToGo: number = 0
  public _distanceRun: number = 0
  public distanceRun: Ref<number> = ref(0)
  public leaveDistance: Ref<number> = ref(0)
  public _points: Array<GPSCoords> = []
  public _callbacks: { [id: string]: CallableFunction } = {}
  public units: DistanceUnits = DistanceUnits.nmile
  public untisKey: string = 'nmile'
  public _speedLog: Array<{ lat: number; lng: number; time: number }> = []
  public speed: Ref<number> = ref(0)
  public dir: Ref<number> = ref(0)
  public time: Ref<string> = ref('')
  public show: Ref<boolean> = ref(false)
  /**
   * Get current GPS from server and update
   */
  public async now(): Promise<void> {
    const data = (await request('/gps/now', {}, 'get')) as false | GPSCoords
    if (data) {
      this.set(data.lat, data.lng, data.dir)
    }
  }
  /**
   * Set current coords and fire update event
   * @param lat - Latitude
   * @param lng - Longitude
   * @param dir - Direction, optional
   */
  public async set(lat: number, lng: number, dir?: number): Promise<void> {
    if (lat !== 0 && lng !== 0) {
      this._lastCoords.lat = lat
      this._lastCoords.lng = lng
      if (dir) this.dir.value = Math.round(dir * 100) / 100
      //Calculate avaregae speed by last 10 points
      let dist = 0
      let time = 0
      this._speedLog.push({ lat: lat, lng: lng, time: Math.floor(Date.now() / 1000) })
      if (this._speedLog.length > 2) {
        for (let i = 1; i < this._speedLog.length; i++) {
          dist += turf.distance(
            [this._speedLog[i - 1].lng, this._speedLog[i - 1].lat],
            [this._speedLog[i].lng, this._speedLog[i].lat],
            { units: 'meters' }
          )
          time += this._speedLog[i].time - this._speedLog[i - 1].time
        }

        const speed = (dist / this.units / time) * 3600

        if (speed > 0) {
          this.speed.value = Math.round(speed * 100) / 100
          this.time.value = secondsToHms((this.leaveDistance.value / speed) * 3600)
        }

        if (!dir)
          this.dir.value =
            Math.round(
              turf.bearing(
                [
                  this._speedLog[this._speedLog.length - 2].lat,
                  this._speedLog[this._speedLog.length - 2]
                ],
                [
                  this._speedLog[this._speedLog.length - 1].lat,
                  this._speedLog[this._speedLog.length - 1].lng
                ]
              ) / 100
            ) * 100
      }
      //If more than 10 points in array - remove firs point
      if (this._speedLog.length > 100) this._speedLog.shift()
      if (dir) this._lastCoords.dir = dir
      this._fire(GPSEvents.update, lat, lng, dir)
      if (this.center.value) this._fire(GPSEvents.center, lat, lng)
      if (this._points.length > 2) {
        const lastDistance = turf.distance(
          [this._points[this._points.length - 1].lng, this._points[this._points.length - 1].lat],
          [lng, lat],
          { units: 'meters' }
        )
        this.distanceRun.value =
          Math.round(((this._distanceRun + lastDistance) / this.units) * 100) / 100
        //Calculate how much distance still need run
        this.leaveDistance.value = this._distanceToGo / this.units - this.distanceRun.value
        if (this.leaveDistance.value < 0) this.leaveDistance.value = 0
      }
    }
  }
  /**
   * Set units coeficient to convert distance
   */
  setUnits(units: keyof typeof DistanceUnits) {
    this.units = DistanceUnits[units]
    this.untisKey = units
  }
  /**
   * Start server GPS service
   */
  public async start(): Promise<void> {
    if ((await request('/gps/start', {}, 'get', true)) as boolean) this.run.value = true
    else this.run.value = false
  }

  /**
   * Stop server GPS service
   */
  public async stop(): Promise<void> {
    if ((await request('/gps/stop', {}, 'get', true)) as boolean) {
      this.run.value = false
    }
  }
  /**
   * Toggle record GPS route
   */
  public async toggleRecord(): Promise<void> {
    if (this.record.value) {
      if (await request('/gps/stoprecord', {}, 'get', true)) this.record.value = false
    } else {
      if (await request('/gps/startrecord', {}, 'get', true)) this.record.value = true
    }
  }
  /**
   * Toggle server GPS service
   */
  public async toggle(): Promise<void> {
    if (this.run.value) await this.stop()
    else await this.start()
  }
  /**
   * Set sample time for GPS service
   * */
  public async SampleTime() {
    //Show input modal and get value from
    const time = (await inputModal(Lang.value.TXT_GPS_SAMPLE_TIME)) as false | string
    //If value, send request
    if (time) await request('/gps/sample', { time: time }, 'post', true)
  }

  public on(event: GPSEvents, callback: CallableFunction) {
    if (callback) {
      this._callbacks[event] = callback
    }
  }

  public _fire(event: GPSEvents, data1?: any, data2?: any, data3?: any, data4?: any) {
    if (this._callbacks[event]) {
      this._callbacks[event](data1, data2, data3, data4)
    }
  }
  /**
   * SET distance to go for time calculation
   */
  public async distanceToGoModal() {
    const data = (await inputModalNew(ModalsList.DistanceToGO, {
      distance: this._distanceToGo
    })) as
      | false
      | {
          distance: number
          units: keyof typeof DistanceUnits
        }
    if (data) {
      if (
        await request(
          '/core/default',
          { distanceToGo: data.distance, units: data.units },
          'post',
          true
        )
      ) {
        this.distanceToGo(data.distance, data.units)
      }
    }
    return this._distanceToGo
  }

  public distanceToGo(distance: number, units: keyof typeof DistanceUnits = 'nmile') {
    this.units = DistanceUnits[units]
    this._distanceToGo = distance * this.units
    this.untisKey = units
  }

  public async GPSConfigModal() {
    const data = (await inputModalNew(ModalsList.GPSConfig)) as
      | false
      | {
          host: string
          port: number
        }
    if (data && data.host && data.port) {
      await request('/core/default', { gpsServer: data }, 'post', true)
    }
  }
  /**
   * Calculate run distance using GPS points
   * @param points - GPS coords array
   */
  public Points(points: Array<GPSCoords> | false) {
    if (points) {
      this._points = points
      this._distanceRun = 0
      for (let i = 1; i < this._points.length; i++) {
        this._distanceRun +=
          Math.floor(
            turf.distance(
              [this._points[i - 1].lng, this._points[i - 1].lat],
              [this._points[i].lng, this._points[i].lat],
              { units: 'meters' }
            ) * 100
          ) / 100
      }
      this.distanceRun.value = Math.round((this._distanceRun / this.units) * 100) / 100
    }
  }

  public RoutePoint(lat: number, lng: number) {
    this._points.push({ lat, lng, dir: 0 })
    if (this._points.length > 1) {
      const length = this._points.length - 1
      this._distanceRun += turf.distance(
        [this._points[length - 1].lng, this._points[length - 1].lat],
        [this._points[length].lng, this._points[length].lat],
        { units: 'meters' }
      )
      this.distanceRun.value = Math.round((this._distanceRun / this.units) * 100) / 100
    }
  }

  public get lastCoords() {
    return this._lastCoords
  }
}
//----------------------------------------------------------------------------------------------------------------------
//INIT new MAPTORIUM GPS class
//----------------------------------------------------------------------------------------------------------------------
const GPS = new MAPTORIUMGPS()
//----------------------------------------------------------------------------------------------------------------------
//EXPORT new MAPTORIUM GPS class
//----------------------------------------------------------------------------------------------------------------------
export default GPS
//----------------------------------------------------------------------------------------------------------------------
//SOCKET.IO for realtime comunication
//----------------------------------------------------------------------------------------------------------------------
import socket from '@/API/Socket'
//----------------------------------------------------------------------------------------------------------------------
//SOCKET.IO new GPS coords event
//----------------------------------------------------------------------------------------------------------------------
socket.on('gps.now', (data: { lat: number; lng: number; dir?: number }) => {
  //Update coords and fire event
  GPS.set(data.lat, data.lng, data.dir)
})
//----------------------------------------------------------------------------------------------------------------------
//SOCKET.IO new GPS route point update event
//----------------------------------------------------------------------------------------------------------------------
socket.on('gps.routepoint', (data: { lat: number; lng: number }) => {
  GPS.RoutePoint(data.lat, data.lng)
})
