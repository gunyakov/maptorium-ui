import ServerData from "./serverdata";
import { setOptions } from "./helpers/setoptions";
import { wait } from "./helpers/wait";
import { DefaultConfig, GPSCoords, MapList, PoiInfo } from "./interfases";
import { EventType, MapFormat } from "./enum";
import MDOM from "./MDOM";

import * as turf from "@turf/turf";

import { arrayRemove } from "./helpers/array";

export default class Maptorium {

    private _jsonData:ServerData;                           //Get json data from server
    private _mapList:boolean | Array<MapList> = false;      //Maps list
    private _currentMap:string = "";                        //Current map
    private _layerList:boolean | Array<MapList> = false;    //Layers list
    private _currentLayers:Array<string> = []               //Default layers list
    private _callbacks:Array<CallableFunction> = [];        //Calback array
    private _MDOM:MDOM;
    private _zoom:number = 0;
    private _lat:number = 0;
    private _lng:number = 0;
    private _routeShow:boolean = false;
    private _routeRecord:boolean = false;
    private _gpsLastPoint:GPSCoords = {lat: 0, lon: 0, dir: 0}

    private options = {
        gpsRouteRecord: false,
        vectorMapSupport: false,
        updateTime: 10000,                               //How often ask server for updates     
        MDOM: new MDOM({init: false})         
    };

    constructor(options:object = {}) {
        //Merge options with default options
        setOptions(this, options);
        //Init protocol to get data from server
        this._jsonData = new ServerData();
        this._MDOM = this.options.MDOM;
        let Maptorium = this;
        //Connect DOM event from menu to handle changing map state
        this._MDOM.on(EventType.mapChangeMap, function(mapID:string) {
            Maptorium._fire(EventType.mapChangeMap, mapID, Maptorium._currentMap);
            Maptorium._currentMap = mapID;       
        });
        this._MDOM.on(EventType.mapAddLayer, function(mapID:string) {
            Maptorium._fire(EventType.mapAddLayer, mapID);
            if(!Maptorium._currentLayers) {
                Maptorium._currentLayers = [];
            }
            Maptorium._currentLayers.push(mapID);
        });
        this._MDOM.on(EventType.mapRemoveLayer, function(mapID:string) {
            Maptorium._currentLayers = arrayRemove(Maptorium._currentLayers, mapID);
            Maptorium._fire(EventType.mapRemoveLayer, mapID);
        });
        this._MDOM.on(EventType.routeShow, async function() {
            await Maptorium._getRoute();
            Maptorium._routeShow = true;
        });
        this._MDOM.on(EventType.routeHide, async function() {
            Maptorium._fire(EventType.routeHide);
            Maptorium._routeShow = false;
        });
        this._MDOM.on(EventType.routeStopRecord, async function() {
            Maptorium._routeRecord = false;
            await Maptorium._jsonData.stopRecord();
        });
        this._MDOM.on(EventType.routeStartRecord, async function() {
            Maptorium._routeRecord = true;
            await Maptorium._jsonData.startRecord();
        });
        this._MDOM.on(EventType.historyShow, async function(historyID:number) {
            Maptorium._getRoute(historyID);
        });
    }

    async init() {
        //Get maps list
        await this._getMapsList();
        //Make routes list
        await this._getRouteList();
        //Get first map from the list
        //@ts-ignore
        this._currentMap = this._mapList[0].id;
        //Fire callback
        if(this._mapList && this._layerList) {
            //@ts-ignore
            this._MDOM.makeMenu(this._mapList);
            //@ts-ignore
            this._MDOM.makeMenu(this._layerList, false);
            //Get default config
            await this._getDefConfig();
            //Fire that script finish all preparations
            this._fire(EventType.init, this._mapList, this._layerList);
            if(this._currentMap) {
                //Fire event to set map
                this._fire(EventType.mapChangeMap, this._currentMap);
                this._MDOM.setState(this._currentMap, true);
            }
            //Fire event to set map layers for all maps layers
            for(let i = 0; i < this._currentLayers.length; i++) {
                this._fire(EventType.mapAddLayer, this._currentLayers[i]);
                this._MDOM.setState(this._currentLayers[i], false);
            }
            //Start service to get updates from server
            this._service();
        }
        
    }

    private async _getMapsList() {
        //------------------------------------------------------------
        //Get maps list from server
        //------------------------------------------------------------
        let allList = await this._jsonData.getMapsList();
        //If get maps list from server
        if(allList) {
            this._mapList = [];
            this._layerList = [];
            for(let i = 0; i < allList.length; i++) {
                let mapInfo = allList[i];
                if(mapInfo.format == MapFormat.vector && this.options.vectorMapSupport == false) {

                }
                else {
                    switch (mapInfo.type) {
                        case "map":
                            this._mapList.push(mapInfo);
                            break;
                        case "layer":
                            this._layerList.push(mapInfo);
                            break;
                        default:
                            console.log(mapInfo.type, "Cant find handler for this map type.");
                            break;
                    }
                }
            }
        }
    }

    private async _getDefConfig() {
        //------------------------------------------------------------
        //Get default config from server
        //------------------------------------------------------------
        let defConfig = await this._jsonData.getDefConfig();
        //If received default config
        if(defConfig) {
            //Override map by default in config
            if(defConfig.map) this._currentMap = defConfig.map;
            if(defConfig.lat) this._lat = defConfig.lat;
            if(defConfig.lng) this._lng = defConfig.lng;
            if(defConfig.zoom) this._zoom = defConfig.zoom;
            //Overide layesr by default in config
            if(defConfig.layers?.length > 0) this._currentLayers = defConfig.layers;
            //Rise center map event
            this._fire(EventType.mapCenter, defConfig.lat, defConfig.lng, defConfig.zoom);
            //If need to show route
            //@ts-ignore
            if(typeof defConfig.showRoute == "string") defConfig.showRoute = (defConfig.showRoute === "true");
            //@ts-ignore
            if(typeof defConfig.recordRoute == "string") defConfig.recordRoute = (defConfig.recordRoute === "true");
            if(defConfig.showRoute) {
                //Show route and save state
                this._getRoute();
                this._MDOM.setButton("gpsRouteShowButton");
                this._routeShow = true;
            }
            if(defConfig.recordRoute) {
                this._routeRecord = true;
                this._MDOM.setButton("gpsRouteRecordButton");
            }
        }
    }

    private async _getRoute(routeID:number = 0) {
        let data = await this._jsonData.getRouteHistory(routeID);
        if(data.points.length > 0) {
            if(routeID > 0) this._fire(EventType.historyShow, data.points);
            else this._fire(EventType.routeShow, data.points);
        }
    }

    public setCoords(lat:number, lng:number):void {
        if(lat && lng) {
            this._lat = lat;
            this._lng = lng;
        } 
    }

    public setZoom(zoom:number):void {
        if(zoom && zoom != this._zoom) {
            this._zoom = zoom;
        }
    }
    public on(event:EventType, callback:CallableFunction) {
        switch (event) {
            case EventType.init:
            case EventType.mapCenter:
            case EventType.gpsCoords:
            case EventType.historyHide:
            case EventType.historyShow:
            case EventType.mapAddLayer:
            case EventType.mapChangeMap:
            case EventType.mapRemoveLayer:
            case EventType.routeHide:
            case EventType.routePoint:
            case EventType.routeShow:
                //If no any callbacks list
                //@ts-ignore
                if(!this._callbacks[event]) {
                    //Make empty list
                    //@ts-ignore
                    this._callbacks[event] = [];
                }
                //Push function to callbacks list
                //@ts-ignore
                this._callbacks[event].push(callback);
                break;
            default:
                console.log("Wrong event type. Pls check it again", event);
                break;
        }
    } 

    private _fire(event:EventType, data:any = false, data1:any = false, data2:any = false, data3:any = false):void {
        //@ts-ignore
        let callBackArray = this._callbacks[event];
        if(callBackArray?.length > 0) {
            for(let i = 0; i < callBackArray.length; i++) {
                let callback = callBackArray[i];
                callback(data, data1, data2, data3);
            }
        }
    }
    //-------------------------------------------------------------------------------
    //Get GPS coordinates from server
    //-------------------------------------------------------------------------------
    private async _getGPSCoords():Promise<void> {
        let data = await this._jsonData.getGPSCoords();
        if(data.lat && data.lon) {
            if(this._gpsLastPoint.lat && this._gpsLastPoint.lon) {
                let bearing = turf.bearing([this._gpsLastPoint.lat, this._gpsLastPoint.lon], [data.lat, data.lon]);
                //data.dir = bearing;
                data.dir = turf.bearingToAngle(bearing);
            }
            this._fire(EventType.gpsCoords, data.lat, data.lon, data.dir);
            this._gpsLastPoint.lat = data.lat;
            this._gpsLastPoint.lon = data.lon;
        }
    }
    //-------------------------------------------------------------------------------
    //Get last route point coordinates from server
    //-------------------------------------------------------------------------------
    private async _getRoutePoint():Promise<void> {
        let data = await this._jsonData.getRoutePoint();
        if(data.lat && data.lon) {
            this._fire(EventType.routePoint, data.lat, data.lon, data.dir);
        }
    }
    //-------------------------------------------------------------------------------
    //Get route list from server
    //-------------------------------------------------------------------------------
    private async _getRouteList():Promise<void> {
        let data = await this._jsonData.getRouteList();
        if(data?.length > 0) {
            this._MDOM.makeRouteList(data);
        }
    }
    //-------------------------------------------------------------------------------
    //Start new route
    //-------------------------------------------------------------------------------
    public async startNewRoute(name:string):Promise<void> {
        await this._jsonData.startNewRoute(name); 
        await this._getRouteList();
    }
    //-------------------------------------------------------------------------------
    //Set network mode
    //-------------------------------------------------------------------------------
    public async setMode(mode:string):Promise<void> {
        await this._jsonData.setMode(mode); 
    }
    //-------------------------------------------------------------------------------
    //Send POI info to server
    //-------------------------------------------------------------------------------
    public async addPOI(POI:PoiInfo):Promise<number> {
        let data = await this._jsonData.addPOI(POI);
        if(data.ID > 0) return data.ID;
        return 0;
    }
    //-------------------------------------------------------------------------------
    //Save config on server
    //-------------------------------------------------------------------------------
    private async _saveConfig():Promise<void> {
        let defConfig:DefaultConfig = {
            map: this._currentMap,
            layers: this._currentLayers,
            lat: this._lat,
            lng: this._lng,
            zoom: this._zoom,
            showRoute: this._routeShow,
            recordRoute: this._routeRecord
        }
        await this._jsonData.setDefConfig(defConfig);
    }
    //-------------------------------------------------------------------------------
    //Run newer ennded cycle to get updates from server
    //-------------------------------------------------------------------------------
    private async _service() {
        while(true) {
            this._saveConfig();
            //Check if have updates on server
            let data = await this._jsonData.getUpdates();
            if(typeof data.stat === "object" && data.stat != null) this._MDOM.showStat(data.stat);
            if(data.gps) {
                this._getGPSCoords();
            }
            if(data.job) {

            }
            if(data.log) {

            }
            if(data.message) {

            }
            if(data.route && this._routeShow) {
                this._getRoutePoint();
            }
            await wait(this.options.updateTime);
        }
    }

}