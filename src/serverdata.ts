import request from "./helpers/ajax";
import { DefaultConfig, GPSCoords, MapList, PoiInfo, RouteList, ServerStat, ServerUpdates } from "./interfases";

export default class ServerData {

    constructor() {

    }

    async getMapsList():Promise<MapList[]> {
        return await request("/core/maps", {}, "get");
    }

    async getDefConfig():Promise<DefaultConfig> {
        return await request("/core/default", {}, "get");
    }

    async setDefConfig(config:{}):Promise<Boolean> {
        await request("/core/default", config, "post");
        return true;
    }

    async getUpdates():Promise<ServerUpdates> {
        return await request("/core/updates", {}, "get");
    }

    async getGPSCoords():Promise<GPSCoords> {
        return await request("/gps/now", {}, "get");
    }

    async getRoutePoint():Promise<GPSCoords> {
        return await request("/gps/point", {}, "get");
    }

    async getRouteHistory(routeID:number = 0):Promise<{id: number, points: Array<GPSCoords>}> {
        let alert = false;
        if(routeID > 0) alert = true;
        return await request("/gps/route", {routeID: routeID}, "post", alert);
    }

    async stopRecord():Promise<void> {
        await request("/gps/stoprecord", {}, "get", true);
    }

    async startRecord():Promise<void> {
        await request("/gps/startrecord", {}, "get", true);
    }

    async startNewRoute(name:string):Promise<void> {
        await request("/gps/routenew", {name: name}, "post", true);
    }

    async setMode(mode:string):Promise<void> {
        await request("/core/mode", {mode: mode}, "post", true);
    }

    async getRouteList():Promise<Array<RouteList>> {
        return await request("/gps/routelist", {}, "get");
    }

    async addPOI(POI:PoiInfo):Promise<{ID: number}> {
        return await request("/poi/add", POI, "post", true);
    }

}