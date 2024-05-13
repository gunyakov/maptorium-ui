//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM interfaces
//----------------------------------------------------------------------------------------------------------------------
import type { RouteList, GPSCoords } from '@/interface'
//----------------------------------------------------------------------------------------------------------------------
//List of Routes events
//----------------------------------------------------------------------------------------------------------------------
import { RoutesEvents } from '@/enum'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM CLASS to get data from Server
//----------------------------------------------------------------------------------------------------------------------
import request from './ajax'
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
//MAPTORIUM CLASS to handle Language support
//----------------------------------------------------------------------------------------------------------------------
import Lang from '@/lang/index'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM Routes class
//----------------------------------------------------------------------------------------------------------------------
class MAPTORIUMROUTES {
  public routes: Ref<Array<RouteList>> = ref([])
  public _callbacks: { [id: string]: CallableFunction } = {}
  public readonly show: Ref<boolean> = ref(false)
  /**
   * Get routes history list from server
   */
  public async List(): Promise<void> {
    const data = (await request('/gps/routelist', {}, 'get')) as Array<RouteList> | false
    if (data) this.routes.value = data
  }
  /**
   * Start new route
   */
  public async New(): Promise<void> {
    //Show input modal and get value from
    const name = (await inputModal(Lang.value.TXT_GPS_ROUTE_NEW_NAME)) as false | string
    //If value, send request
    if (name) await request('/gps/routenew', { name: name }, 'post', true)
  }
  /**
   * Get points for specific route
   * @param ID - Route ID from RouteList, default is 0 - current route
   */
  public async Points(routeID: number = 0): Promise<Array<GPSCoords> | false> {
    let alert = false
    if (routeID > 0) alert = true
    const routePoints = (await request(`/gps/route/${routeID}`, {}, 'get', alert)) as
      | Array<GPSCoords>
      | false
    if (routePoints) {
      if (this.show.value) this._fire(RoutesEvents.route, routeID, routePoints)
      return routePoints
    }
    return false
  }
  /**
   * Fire event about new point in route
   * @param lat - Latitude
   * @param lng - Longitude
   */
  public Point(lat: number, lng: number) {
    if (lat && lng) {
      this._fire(RoutesEvents.point, lat, lng)
    }
  }

  public Hide() {
    this.show.value = false
    this._fire(RoutesEvents.hide)
  }

  public on(event: RoutesEvents, callback: CallableFunction) {
    if (callback) {
      this._callbacks[event] = callback
    }
  }

  public _fire(event: RoutesEvents, data1?: any, data2?: any, data3?: any, data4?: any) {
    if (this._callbacks[event]) {
      this._callbacks[event](data1, data2, data3, data4)
    }
  }
}
//----------------------------------------------------------------------------------------------------------------------
//INIT new MAPTORIUM Routes class
//----------------------------------------------------------------------------------------------------------------------
const Routes = new MAPTORIUMROUTES()
//----------------------------------------------------------------------------------------------------------------------
//EXPORT new MAPTORIUM Routes class
//----------------------------------------------------------------------------------------------------------------------
export default Routes
//----------------------------------------------------------------------------------------------------------------------
//SOCKET.IO for realtime comunication
//----------------------------------------------------------------------------------------------------------------------
import socket from './Socket'
//----------------------------------------------------------------------------------------------------------------------
//SOCKET.IO new Route point event
//----------------------------------------------------------------------------------------------------------------------
socket.on('gps.routepoint', (data: { lat: number; lng: number }) => {
  Routes.Point(data.lat, data.lng)
})
