import request from "./helpers/ajax";
import { DefaultConfig, GPSCoords, GenJobInfo, JobInfo, MapList, PoiInfo, RouteList, ServerUpdates} from "./interfases";
import { JobType } from "./enum";

export default {

    getMapsList: async function():Promise<MapList[]> {
        return await request("/core/maps", {}, "get");
    },

    getDefConfig: async function():Promise<DefaultConfig> {
        return await request("/core/default", {}, "get");
    },

    setDefConfig: async function(config:{}, showNotification = true):Promise<Boolean> {
        return await request("/core/default", config, "post", showNotification);
    },

    getUpdates: async function():Promise<ServerUpdates> {
        return await request("/core/updates", {}, "get");
    },

    getGPSCoords: async function():Promise<GPSCoords> {
        return await request("/gps/now", {}, "get");
    },

    getRoutePoint: async function():Promise<GPSCoords> {
        return await request("/gps/point", {}, "get");
    },

    getRouteHistory: async function(routeID:number = 0):Promise<Array<GPSCoords>> {
        let alert = false;
        if(routeID > 0) alert = true;
        return await request(`/gps/route/${routeID}`, {}, "get", alert);
    },

    stopRecord: async function():Promise<void> {
        await request("/gps/stoprecord", {}, "get", true);
    },

    startRecord: async function():Promise<void> {
        await request("/gps/startrecord", {}, "get", true);
    },

    startNewRoute: async function(name:string):Promise<void> {
        await request("/gps/routenew", {name: name}, "post", true);
    },

    getRouteList: async function():Promise<Array<RouteList>> {
        return await request("/gps/routelist", {}, "get");
    },

    addPOI: async function(POI:PoiInfo):Promise<{ID: number}> {
        return await request("/poi/add", POI, "post", true);
    },

    getPOIList: async function():Promise<Array<PoiInfo>> {
        return await request("/poi", {}, "get");
    },

    deletePOI: async function(ID:number):Promise<boolean> {
        return await request("/poi/delete", {ID: ID}, "post", true);
    },

    updatePOI: async function(ID:number, type:string, points:Array<GPSCoords>):Promise<boolean> {
        let result:Array<PoiInfo> = await request("/poi/update", {ID: ID, points: points, type: type}, "post", true);
        if(result) return true;
        else return false;
    },

    getCachedMapBBOX: async function(bbox:Array<number>, zoom:number, map:string):Promise<void> {
        await request("/map/cached/bbox", {bbox:bbox, zoom: zoom, map: map}, "post", false);
    },

    getCachedMapPOI: async function(poiID:number, zoom:number, map:string):Promise<void> {
        await request("/map/cached/poi", {poiID:poiID, zoom: zoom, map: map}, "post", false);
    },

    cancelCachedMapBuild: async function():Promise<boolean> {
        return await request("/map/cached/cancel", {}, "get", true)
    },

    cleanCachedMap: async function():Promise<boolean> {
        return await request("/map/cached/clean", {}, "get", true);
    },

    setGPSSampleTime: async function (time:number) {
        return await request("/gps/sample", {time:time}, "post", true);
    },

    getJobsList: async function () {
        return await request("/job/list", {}, "get") as Array<{ID:string, running:boolean, mapID:string, type: JobType}>;
    },

    jobAdd: async function(data:JobInfo) {
        return await request("/job/download", data, "post", true) as boolean;
    },

    jobGenAdd: async function(data:GenJobInfo) {
        return await request("/job/generate", data, "post", true) as boolean;
    },

    jobUp: async function(jobID:string):Promise<boolean> {
        return await request(`/job/up/${jobID}`, {}, "get", true) as boolean;
    },

    jobDelete: async function(jobID:string):Promise<boolean> {
        return await request(`/job/delete/${jobID}`, {}, "get", true) as boolean;
    },

    jobDown: async function(jobID:string):Promise<boolean> {
        return await request(`/job/down/${jobID}`, {}, "get", true) as boolean;
    },

    jobStart: async function(jobID:string):Promise<boolean> {
        return await request(`/job/start/${jobID}`, {}, "get", true) as boolean;
    },
    jobStop: async function(jobID:string):Promise<boolean> {
        return await request(`/job/stop/${jobID}`, {}, "get", true) as boolean;
    },
}