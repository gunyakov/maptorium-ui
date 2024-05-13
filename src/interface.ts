import type {
  eMapType,
  eMapFormat,
  NetworkMode,
  POIType,
  JobType,
  DownloadMode,
  ManagerItemType,
  TileInCache,
  DistanceUnits
} from './enum'
export interface iMapItem {
  id: string
  type: eMapType
  name: string
  title?: string
  tileSize: number
  attribution: string
  content: string
  format: eMapFormat
  submenu: string
}

export interface GPSCoords {
  lat: number
  lng: number
  dir?: number
}

export interface Style {
  name?: string
  color?: string
  width?: number
  fillColor?: string
  fillOpacity?: number
  dasharray?: Array<number>
  radius?: number
}

export interface Statistic {
  download: number
  error: number
  empty: number
  size: number
  skip: number
  queue: number
}

export interface DefaultConfig {
  map: string
  layers: Array<string>
  lat: number
  lng: number
  zoom: number
  showRoute?: boolean
  recordRoute?: boolean
  gpsSampleTime?: number
  mode?: NetworkMode
  jobManager?: boolean
  poiManager?: boolean
  GPSInfoPanel?: boolean
  distanceToGo?: number
  gpsServiceRun?: boolean
  style?: string
  units?: keyof typeof DistanceUnits
}
export interface RouteList {
  ID: number
  name: string
  distance: number
}

export interface POIInfo {
  ID: number
  categoryID: number
  name: string
  type: POIType
  color: string
  width: number
  fillColor: string
  fillOpacity: number
  points: Array<GPSCoords>
  visible: number
}

export interface Features {
  type: string
  features: [
    {
      type: string
      geometry: {
        type: string
        coordinates: Array<[lng: number, lat: number]>
      }
    }
  ]
}

export interface SelectItem {
  value: string | number
  title: string
}

export interface iJobList {
  ID: string
  running: boolean
  mapID: string
  type: JobType
}

export interface iGenJobConfig {
  ID: string
  mapID: string
  polygonID: number
  zoom: Array<string>
  updateTiles: boolean
  completeTiles: boolean
  fromZoom: string
  previousZoom: boolean
}

export interface iJobStat {
  download: number
  error: number
  empty: number
  size: number
  skip: number
  time: number
  total: number
  queue: number
  progress: number
  sizeFormated: string
  timeFormated: string
  timeETA: string
  processed: number
}
export interface iNetworkConfig {
  state: DownloadMode
  request: {
    userAgent: string
    timeout: number
    delay: number
  }
  banTimeMode: boolean
  proxy: {
    enable: boolean
    server: {
      protocol: string
      host: string
      port: number
    }
    authRequired: boolean
    auth: {
      username: string
      password: string
    }
    tor?: {
      enable: boolean
      HashedControlPassword: string
      ControlPort: number
    }
  }
}
export interface iJobInfo {
  mapID: string
  randomDownload: boolean
  updateTiles: boolean
  updateDifferent: boolean
  updateDateTiles: boolean
  dateTiles: string
  emptyTiles: boolean
  checkEmptyTiles: boolean
  updateDateEmpty: boolean
  dateEmpty: string
  zoom: { [id: number]: boolean }
}
export interface iJobConfig {
  polygonID: number
  customNetworkConfig: boolean
  network?: iNetworkConfig
  download?: iJobInfo
}

export interface ManagerList {
  ID: number
  name: string
  parentID: number
  order: number
  type: ManagerItemType
  items?: Array<ManagerList>
}

export interface CategoryItem {
  ID: number
  name: string
  parentID: number
  order: number
}

export interface CachedTilesInfo {
  map: string
  zoom: number
  tiles: { [id: number]: { [id: number]: TileInCache } }
}
