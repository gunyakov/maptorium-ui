import { MapFormat, MapType, ResponseType } from "./enum"

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
    lat: number,
    lng: number,
    zoom: number,
    map: string,
    layers: Array<string>,
    showRoute: boolean,
    recordRoute: boolean
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
    lon: number,
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
    type: string,
    points: Array<GPSCoords>
    color: string,
    fillColor: string,
    opacity: number
}