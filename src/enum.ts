export enum eLanguageList {
  ru = 'ru',
  en = 'en'
}

export enum eMapType {
  map = 'map',
  layer = 'layer'
}

export enum eMapFormat {
  rasted = 'rasted',
  vector = 'vector'
}

export enum ResponseType {
  success = 'success',
  info = 'info',
  warning = 'warning',
  error = 'error'
}
//----------------------------------------------------------------------------------------------------------------------
//List of GPS events
//----------------------------------------------------------------------------------------------------------------------
export enum GPSEvents {
  update = 'update',
  center = 'center'
}
//----------------------------------------------------------------------------------------------------------------------
//List of Routes events
//----------------------------------------------------------------------------------------------------------------------
export enum RoutesEvents {
  route = 'route',
  point = 'point',
  hide = 'hide'
}
//----------------------------------------------------------------------------------------------------------------------
//List of General API events
//----------------------------------------------------------------------------------------------------------------------
export enum APIEvents {
  lang = 'lang',
  mapChangeMap = 'map.change',
  mapAddLayer = 'map.layerAdd',
  mapRemoveLayer = 'map.layerRemove',
  cacheMap = 'cache.map',
  cacheTile = 'cache.tile'
}
export enum POIEvents {
  polygon = 'polygon',
  polyline = 'polyline',
  point = 'point',
  delete = 'delete',
  update = 'update'
}
//----------------------------------------------------------------------------------------------------------------------
//List of Network modes
//----------------------------------------------------------------------------------------------------------------------
export enum NetworkMode {
  null = 'null',
  enable = 'enable',
  disable = 'disable',
  force = 'force'
}
//List of distance Unit conveters
export enum DistanceUnits {
  kilometer = 1000,
  nmile = 1852,
  mile = 1609,
  foot = 0.3048,
  yard = 0.9144,
  meter = 1
}
export enum POIType {
  point = 'point',
  polygon = 'polygon',
  polyline = 'polyline',
  square = 'square'
}
export enum JobType {
  download = 'download',
  generate = 'generate'
}
export enum DownloadMode {
  enable = 'enable',
  disable = 'disable',
  force = 'force'
}

export enum MAPEvents {
  init = 'init',
  POIRefresh = 'poi.refresh',
  ctxMenuShow = 'cxtmenu.show',
  ctxMenuHide = 'ctxmenu.hide'
}

export enum ManagerItemType {
  folder = 'folder',
  item = 'item'
}

export enum TileInCache {
  missing = 'missing',
  present = 'present',
  empty = 'empty'
}
