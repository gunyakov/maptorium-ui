import { MapFormat, MapType, POIType, ResponseType, DownloadMode, TileInCache } from "./enum"

export interface MapList {
    id: string,
    type: MapType,
    name: string,
    tilesize: number,
    attribution: string,
    content: string,
    format: MapFormat,
    submenu: string
}

export interface ServerResponse {
    result: ResponseType,
    message: string,
    data: Array<any> | Object
}

export interface DefaultConfig {
    map: string,
    layers: Array<string>,
    lat: number,
    lng: number,
    zoom: number,
    showRoute?: boolean,
    recordRoute?: boolean,
    gpsSampleTime?: number,
    mode?: DownloadMode,
    jobManager?: boolean,
    GPSInfoPanel?: boolean,
    distanceToGo?: number;
}

export interface ServerUpdates {
    gps: boolean,
    message: boolean,
    log: boolean,
    job: boolean,
    route: boolean,
    stat: ServerStat
}

export interface GPSCoords {
    lat:number,
    lng: number,
    dir: number
}

export interface RouteList {
    ID: string,
    name: string,
    distance: number
}

export interface ServerStat {
    memory: number,
    fsRead: number,
    fsWrite: number,
    cpu: number,
    download: number,
    queue: number,
    size: number
}

export interface PoiInfo {
    type: POIType,
    name: string,
    ID: number,
    categoryID: number,
    color: string,
    fillColor: string,
    fillOpacity: number,
    width: number,
    visible: number,
    points: Array<GPSCoords>
}

export interface CategoryList {
    ID:number,
    name: string,
    parentID: number,
    order: number
} 

export interface JobInfo {
    ID: string,
    polygonID: number,
    mapID: string,
    randomDownload: boolean,
    updateTiles: boolean,
    updateDifferent: boolean,
    updateDateTiles: boolean,
    dateTiles: string,
    emptyTiles: boolean,
    checkEmptyTiles: boolean,
    updateDateEmpty: boolean,
    dateEmpty: string,
    zoom: Array<number>
}

export interface GenJobInfo {
    ID: string,
    mapID:string,
    polygonID: number,
    zoom: Array<string>,
    updateTiles: boolean,
    completeTiles: boolean,
    fromZoom: string
    previousZoom: boolean
}

export interface JobStat {
    download: number,
    error: number,
    empty: number,
    size: number,
    skip: number,
    time: number,
    total: number,
    queue: number
}

export interface GenJobStat {
    skip: number,
    procesed: number,
    total: number,
    time: number,
    readed: number,
    size: number
}

export interface CachedTilesInfo {
    map: string,
    zoom: number,
    tiles: {[id:number]:{[id:number]: TileInCache}}
}

export interface Statistic {
    download: number,
    error: number,
    empty: number,
    size: number,
    skip: number,
    queue: number
}