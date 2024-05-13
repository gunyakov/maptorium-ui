import {
  APIEvents,
  POIEvents,
  GPSEvents,
  RoutesEvents,
  POIType,
  MAPEvents,
  TileInCache
} from '@/enum'
import type { CachedTilesInfo, GPSCoords, POIInfo, Style, iMapItem } from '@/interface'
import API from '@/API/index'
import Map from '@/map/index'
import TileGrid from '@/map/TileGrid'
import Drawer from '@/map/Drawer'
import CachedMap from '@/map/CachedMap'
import MenuContext from '@/API/MenuContext'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
//import router from './router'

const app = createApp(App)

app.use(createPinia())
//pp.use(router)

app.mount('#app')
//Change base map
API.on(APIEvents.mapChangeMap, (mapInfo: iMapItem, style?: string) => {
  Map.SetMap(mapInfo, style)
})
//Add layer on map
API.on(APIEvents.mapAddLayer, (mapInfo: iMapItem, style?: string) => {
  Map.AddLayer(mapInfo, style)
})
//Add layer on map
API.on(APIEvents.mapRemoveLayer, (mapInfo: iMapItem) => {
  Map.RemoveLayer(mapInfo)
})
//UPDATE Marker position when GPS was updated
API.GPS.on(GPSEvents.update, (lat: number, lng: number, dir: number) => {
  Map.GPSMarker(lat, lng, dir)
})
//Draw route
API.Routes.on(RoutesEvents.route, (ID: number, points: Array<GPSCoords>) => {
  if (ID == 0) Map.GPSRoute?.Points(points)
})
API.Routes.on(RoutesEvents.point, (lat: number, lng: number) => {
  Map.GPSRoute?.pushPoint(lat, lng)
})
API.Routes.on(RoutesEvents.hide, () => {
  Map.GPSRoute?.hide()
})
//Update map center if center button activated
API.GPS.on(GPSEvents.center, (lat: number, lng: number, zoom?: number) => {
  Map.mapCenter(lat, lng, zoom)
})
//Change lang for map
API.on(APIEvents.lang, (lang: string) => {
  Map.mapLang(lang)
})
//Draw polygon on map
API.POI.on(POIEvents.polygon, (id: number, coords: Array<GPSCoords>, options?: Style) => {
  Map.PoiAdd(POIType.polygon, id, coords, options)
})
//Draw polyline on map
API.POI.on(POIEvents.polyline, (id: number, coords: Array<GPSCoords>, options?: Style) => {
  Map.PoiAdd(POIType.polyline, id, coords, options)
})
//Draw point on map
API.POI.on(POIEvents.point, (id: number, coords: Array<GPSCoords>, options?: Style) => {
  Map.PoiAdd(POIType.point, id, coords, options)
})
//Delete poi from map
API.POI.on(POIEvents.delete, (poiID: number) => {
  Map.PoiDelete(poiID)
})
//Redraw poi on map
API.POI.on(POIEvents.update, (poiInfo: POIInfo) => {
  Map.PoiUpdate(poiInfo.ID, poiInfo)
})
//Draw tile polygon on map and save it on server
TileGrid.onSelect((POI: POIInfo) => {
  API.POI.Add(POI)
})
API.on(APIEvents.cacheMap, (data: CachedTilesInfo) => {
  CachedMap.setData(data)
})
API.on(APIEvents.cacheTile, (x: number, y: number, state: TileInCache) => {
  CachedMap.updateTile(x, y, state)
})
//Fired when map finish initialization
Map.on(MAPEvents.init, async (map: maplibregl.Map) => {
  TileGrid.onAdd(map)
  Drawer.addOn(map)
  CachedMap.addOn(map)
  await API.MapsList()
  await API.DefConfig()
  await API.POI.Category()
  await API.Routes.List()
  await API.JobManager.List()
  API.mapLoaded = true
  //Get default config from server
})
//Call POI list function to get POI from server and draw them after cleaning map style
Map.on(MAPEvents.POIRefresh, async () => {})
//Fired when left mouse click to hide context menu
Map.on(MAPEvents.ctxMenuHide, () => {
  MenuContext.hide()
})
//Fired when right mouse click to show context menu at this point
Map.on(
  MAPEvents.ctxMenuShow,
  (
    mID: number,
    poiType: POIType,
    point: { x: number; y: number },
    coords: { lat: number; lng: number }
  ) => {
    API.POI.poiID = mID
    API.POI.poiCoords = { ...coords }
    API.POI.poiType = poiType
    MenuContext.show(point.x, point.y)
  }
)
