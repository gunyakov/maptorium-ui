//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM interfaces
//----------------------------------------------------------------------------------------------------------------------
import type { RouteList, GPSCoords } from 'src/interface';
//----------------------------------------------------------------------------------------------------------------------
//List of Routes events
//----------------------------------------------------------------------------------------------------------------------
import { RoutesEvents } from 'src/enum';
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM CLASS to get data from Server
//----------------------------------------------------------------------------------------------------------------------
import request from 'src/API/ajax';
import { requestPath } from 'src/API/ajax';
//----------------------------------------------------------------------------------------------------------------------
//Imports from VUE
//----------------------------------------------------------------------------------------------------------------------
import { ref } from 'vue';
import type { Ref } from 'vue';
//----------------------------------------------------------------------------------------------------------------------
//Quasar prompt dialogs
//----------------------------------------------------------------------------------------------------------------------
import { usePrompt } from 'src/composables/usePrompt';
const prompt = usePrompt();
import { useRouteHistoryStore } from 'src/stores/routeHistory';
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM Routes class
//----------------------------------------------------------------------------------------------------------------------
class MAPTORIUMROUTES {
  public routes: Ref<Array<RouteList>> = ref([]);
  public _callbacks: { [id: string]: CallableFunction } = {};
  public readonly onMap: Ref<boolean> = ref(false);

  constructor() {
    this.refresh().catch((e) => {
      console.error(e?.message ?? e);
    });
  }

  /**
   * Get routes history list from server
   */
  public async refresh(): Promise<void> {
    const data = (await request('gps.routelist', {}, 'get')) as Array<RouteList> | false;
    if (data) this.routes.value = data;
  }
  /**
   * Start new route
   */
  public async new(): Promise<void> {
    //Show input modal and get value from
    const name = (await prompt(
      'dialog.gps.route_new_name.title',
      'dialog.gps.route_new_name.descr',
    )) as false | string;
    //If value, send request
    if (name) {
      await request('gps.routenew', { name: name }, 'post', true);
      await this.refresh();
    }
  }
  /**
   * Get points for specific route
   * @param ID - Route ID from RouteList, default is 0 - current route
   */
  public async Points(routeID: number = 0): Promise<Array<GPSCoords> | false> {
    const historyStore = useRouteHistoryStore();

    if (routeID > 0 && historyStore.isVisible(routeID)) {
      historyStore.removeRoute(routeID);
      return false;
    }

    const alert = routeID > 0;
    const routePoints = (await requestPath(`/gps/route/${routeID}`, {}, 'get', alert)) as
      | Array<GPSCoords>
      | false;

    if (routePoints) {
      if (routeID > 0) {
        historyStore.setRoute(routeID, routePoints);
      }
      if (this.onMap.value) this._fire(RoutesEvents.route, routeID, routePoints);
      return routePoints;
    }
    return false;
  }
  /**
   * Fire event about new point in route
   * @param lat - Latitude
   * @param lng - Longitude
   */
  public Point(lat: number, lng: number) {
    if (lat && lng) {
      this._fire(RoutesEvents.point, lat, lng);
    }
  }

  public hide() {
    this.onMap.value = false;
    this._fire(RoutesEvents.hide);
  }

  public show() {
    this.onMap.value = true;
    this.Points().catch((e) => {
      console.error(e.message);
    });
  }

  toggle() {
    if (this.onMap.value) {
      this.hide();
    } else {
      this.show();
    }
  }

  public on(event: RoutesEvents, callback: CallableFunction) {
    if (callback) {
      this._callbacks[event] = callback;
    }
  }

  public _fire(
    event: RoutesEvents,
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
//INIT new MAPTORIUM Routes class
//----------------------------------------------------------------------------------------------------------------------
const Routes = new MAPTORIUMROUTES();
//----------------------------------------------------------------------------------------------------------------------
//EXPORT new MAPTORIUM Routes class
//----------------------------------------------------------------------------------------------------------------------
export default Routes;
//----------------------------------------------------------------------------------------------------------------------
//SOCKET.IO for realtime comunication
//----------------------------------------------------------------------------------------------------------------------
import socket from 'src/API/Socket';
//----------------------------------------------------------------------------------------------------------------------
//SOCKET.IO new Route point event
//----------------------------------------------------------------------------------------------------------------------
socket.on('gps.routepoint', (data: { lat: number; lng: number }) => {
  Routes.Point(data.lat, data.lng);
});
