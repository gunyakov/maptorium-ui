//-----------------------------------------------------------------------------------------------
//SOCKET IO
//-----------------------------------------------------------------------------------------------
import { io, Socket } from "socket.io-client";
//-----------------------------------------------------------------------------------------------
//CALLBACK FUNCTION
//-----------------------------------------------------------------------------------------------
import { fire } from "./helpers/callbacks";
import { formatBytes } from "./helpers/formatBytes";
import { EventType, TileInCache } from "./enum";
import { CachedTilesInfo, Statistic, JobStat, GenJobStat } from "./interfases";
//-----------------------------------------------------------------------------------------------
//OTHER FUNCTIONS
//-----------------------------------------------------------------------------------------------
import GPSInfo from "./DOM/GPSInfo";
import ModalCachedMap from "./DOM/ModalCachedMap";
import { setJobStat } from "./DOM/JobManager";
import { refreshJobList } from "./DOM/JobManager";
//-----------------------------------------------------------------------------------------------
//SOCKET IO INIT
//-----------------------------------------------------------------------------------------------
const socket: Socket = io();
//-----------------------------------------------------------------------------------------------
//SOCKET DISCONNECT
//-----------------------------------------------------------------------------------------------
socket.on('disconnect', () => {
    console.log("Disconnected");  
})
socket.on('connect', () => {
    refreshJobList(); 
})
//-----------------------------------------------------------------------------------------------
//SOCKET IO EVENTS
//-----------------------------------------------------------------------------------------------
socket.on("cachedtile.map", (data:CachedTilesInfo) => {
    fire(EventType.cachedTileMap, data);
});
//Update state for cached bar
socket.on("cachedtile.progress", (data:{tiles: number, total:number}) => {
    ModalCachedMap.setCachedBar(data.tiles, data.total);
});
socket.on("cachedtile.tile", (data:{x:number, y:number, state: TileInCache}) => {
    fire(EventType.cachedTileMapTile, data);
});
//When get GPS coords update
socket.on("gps.now", (data:{lat:number, lng:number, dir?:number}) => {
    //Update coords and fire event
    GPSInfo.setCoords(data.lat, data.lng, data.dir || 0);
});
//When get GPS route point update
socket.on("gps.routepoint", (data:{lat:number, lng:number}) => {
    GPSInfo.setRoutePoint(data.lat, data.lng);
});
//When new stat arrive from server
socket.on("stat", (stat:Statistic) => {
    console.log(stat);
    //@ts-ignore
    document.getElementById("mQueue")?.innerHTML = "&nbsp;Queue: " + stat.queue;
    //@ts-ignore
    document.getElementById("mDownload")?.innerHTML = "&nbsp;Download " + stat.download + " (" + formatBytes(stat.size, 2) + ")";
});
//When need update job stat
socket.on("stat.job", (data:{ID:string, stat:JobStat}) => {
    setJobStat(data.ID, data.stat.queue, data.stat.total, data.stat.time, data.stat.size, data.stat.empty, data.stat.skip, data.stat.error);
});
//When need update job stat
socket.on("stat.gen", (data:{ID:string, stat:GenJobStat}) => {
    setJobStat(data.ID, data.stat.total - data.stat.procesed, data.stat.total, data.stat.time, data.stat.size, data.stat.readed, data.stat.skip, 0);
});

export default socket;


