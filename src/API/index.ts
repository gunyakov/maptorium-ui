import {
  APIEvents,
  GPSEvents,
  NetworkMode,
  eMapFormat,
  eMapType,
  TileInCache,
  DistanceUnits
} from '@/enum'
import type { DefaultConfig, iMapItem, SelectItem, CachedTilesInfo } from '@/interface'

import request from './ajax'

import { ref } from 'vue'
import type { Ref } from 'vue'

import GPSClass from '@/API/GPS'
import RoutesClass from './Routes'
import JobManager from '@/API/JobManager'
import POI from '@/API/POI'
import Alerts from '@/alerts'
import Lang from '@/lang/index'
//----------------------------------------------------------------------------------------------------------------------
//SOCKET.IO for realtime comunication
//----------------------------------------------------------------------------------------------------------------------
import socket from './Socket'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM API main class
//----------------------------------------------------------------------------------------------------------------------
class MaptoriumAPI {
  private _mapsList: { [id: string]: iMapItem } = {}
  private _rawMapsList: Ref<Array<SelectItem>> = ref([])

  private _baseMap: Ref<string> = ref('')
  private _baseMapButton: Ref<number> = ref(0)
  private _layersList: Array<string> = []

  public mapLoaded: boolean = false
  public GPS = GPSClass
  public Routes = RoutesClass
  //@ts-ignore
  public JobManager = JobManager
  public POI = POI
  public mode = ref(NetworkMode.null)
  private _callbacks: { [id: string]: CallableFunction } = {}
  private _cachedBarInfo = ref({ tiles: 0, total: 0 })
  private _cachedBarShow = ref(false)
  private _logList: Ref<
    Array<{ module: string; type: string; message: string; time: number; formatedTime: string }>
  > = ref([])

  constructor() {
    socket.on('cachedtile.map', (data: CachedTilesInfo) => {
      this._fire(APIEvents.cacheMap, data)
    })
    //Update state for cached bar
    socket.on('cachedtile.progress', (data: { tiles: number; total: number }) => {
      this._cachedBarInfo.value = data
      if (data.tiles == data.total) this._cachedBarShow.value = false
      else this._cachedBarShow.value = true
    })
    socket.on('cachedtile.tile', (data: { x: number; y: number; state: TileInCache }) => {
      this._fire(APIEvents.cacheTile, data.x, data.y, data.state)
    })
    socket.on(
      'message',
      (data: { module: string; type: string; message: string; time: number }) => {
        const date = new Date()
        data.formatedTime =
          date.getDay() +
          ' ' +
          date.toLocaleString('en-US', { month: 'long' }) +
          ' ' +
          date.getHours() +
          ':' +
          date.getMinutes()
        this._logList.value.push(data)
        if (this._logList.value.length > 10) this._logList.value.shift()
      }
    )
  }
  /**
   * Get full maps list from server
   */
  public async MapsList(): Promise<void> {
    const data = (await request('/core/maps', {}, 'get')) as false | Array<iMapItem>
    if (data) {
      this._mapsList = {}
      this._rawMapsList.value = []
      data.forEach((value) => {
        value.title = value.name
        if (value.type == eMapType.layer) {
          this._mapsList[value.id] = value
          // if (!this._layerMapsList.value[value.submenu])
          //   this._layerMapsList.value[value.submenu] = []
          // this._layerMapsList.value[value.submenu].push(value)
        }
        if (value.type == eMapType.map) {
          this._mapsList[value.id] = value
          // if (!this._baseMapsList.value[value.submenu]) this._baseMapsList.value[value.submenu] = []
          // this._baseMapsList.value[value.submenu].push(value)
        }
        this._rawMapsList.value.push({ value: value.id, title: value.name })
      })
      //console.log(this._mapsList)
    }
  }

  public get rawMapsList() {
    return this._rawMapsList
  }
  public get logList() {
    return this._logList
  }
  public cleanLog() {
    this._logList.value = []
  }
  /**
   * Get default config from Server
   * @param showNotification - Show notification after finishing API request, default: true
   */
  public async DefConfig(showNotification = true): Promise<void> {
    const defConfig = (await request('/core/default', [], 'get', showNotification)) as
      | DefaultConfig
      | false
    if (defConfig) {
      if (defConfig.mode) this.mode.value = defConfig.mode
      if (defConfig.distanceToGo) this.GPS.distanceToGo(defConfig.distanceToGo, defConfig.units)
      if (defConfig.recordRoute) this.GPS.record.value = defConfig.recordRoute
      if (defConfig.gpsServiceRun) this.GPS.run.value = defConfig.gpsServiceRun
      if (defConfig.map)
        this._fire(APIEvents.mapChangeMap, this._mapsList[defConfig.map], defConfig.style)
      if (defConfig.layers) {
        defConfig.layers.forEach((item) => {
          this.LayerToggle(item, defConfig.style)
        })
      }
      //As maplibre heavy, its required to wait until map will be loaded full to draw route history, center map, etc in auto
      const timer = setInterval(async () => {
        if (this.mapLoaded) {
          if (defConfig.GPSInfoPanel) this.GPS.show.value = defConfig.GPSInfoPanel
          if (defConfig.jobManager) this.JobManager.show.value = defConfig.jobManager
          if (defConfig.poiManager) this.POI.show.value = defConfig.poiManager
          if (defConfig.showRoute) {
            this.Routes.show.value = true
            this.GPS.Points(await this.Routes.Points())
          }
          if (defConfig.lat && defConfig.lng && defConfig.zoom) {
            this.GPS._fire(GPSEvents.center, defConfig.lat, defConfig.lng, defConfig.zoom)
          }
          clearInterval(timer)
        }
      }, 1000)
    }
  }
  /**
   * Set default config on server
   * @param config - Config to update. In {key: value}
   * @param showNotification - - Show notification after finishing API request, default: true
   * @returns true if OK, false in error case
   */
  public async DefConfigSet(config: {}, showNotification = true): Promise<Boolean> {
    return await request('/core/default', config, 'post', showNotification)
  }
  /**
   * Change network mode on server
   * @param mode - Network mode: eneble, disable, force
   */
  public async NetworkMode(mode: NetworkMode): Promise<void> {
    const result = (await request('/core/mode', { mode: mode }, 'post', true)) as boolean
    if (result) {
      this.mode.value = mode
    }
  }
  /**
   * Change language for strings and map
   * @param lang - language shortcut
   */
  public SetLang(lang: string) {
    this._fire(APIEvents.lang, lang)
  }

  public on(event: APIEvents, callback: CallableFunction) {
    if (callback) {
      this._callbacks[event] = callback
    }
  }

  public _fire(event: APIEvents, data1?: any, data2?: any, data3?: any, data4?: any) {
    if (this._callbacks[event]) {
      this._callbacks[event](data1, data2, data3, data4)
    }
  }
  /**
   * Change base map source or style.
   * @param mapID - Map ID
   * @param style - Map style
   * @param buttonNumber - Optional. used to set proper background for buttons
   */
  public MapChange(mapID: string, style?: string, buttonNumber: number = 0) {
    if (this._callbacks[APIEvents.mapChangeMap]) {
      if (this._mapsList[mapID]) {
        this._baseMap.value = mapID
        this._baseMapButton.value = buttonNumber
        this._callbacks[APIEvents.mapChangeMap](this._mapsList[mapID], style)
        this.DefConfigSet({ map: mapID, style: style }, true)
      } else {
        console.log('Cant find map info. Pls check server.')
      }
    }
  }

  public LayerToggle(mapID: string, style?: string) {
    let layerInArray = false
    let anyVectorMap = false
    let itemIndex = 0
    this._layersList.forEach((item, index) => {
      if (item == mapID) {
        layerInArray = true
        itemIndex = index
      }
      if (this._mapsList[item].format == eMapFormat.vector) anyVectorMap = true
    })
    if (layerInArray) {
      this._layersList.splice(itemIndex, 1)
      this.DefConfigSet({ layers: this._layersList })
      this._fire(APIEvents.mapRemoveLayer, this._mapsList[mapID])
    } else {
      if (anyVectorMap && this._mapsList[mapID].format == eMapFormat.vector) {
        Alerts.error(Lang.value.ERR_ONLY_ONE_VECTOR)
        return
      }
      this._layersList.push(mapID)
      this.DefConfigSet({ layers: this._layersList })
      this._fire(APIEvents.mapAddLayer, this._mapsList[mapID], style)
    }
    if (style) this.DefConfigSet({ style: style }, false)
  }

  public get baseMap() {
    return this._baseMap
  }

  public get baseMapButton() {
    return this._baseMapButton.value
  }

  public get cachedBarInfo() {
    return this._cachedBarInfo
  }

  public get cachedBarShow() {
    return this._cachedBarShow
  }
}

const API = new MaptoriumAPI()

export default API
