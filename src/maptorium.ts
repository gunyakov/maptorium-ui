import ServerData from "./serverdata";
import { GPSCoords, MapList, PoiInfo } from "./interfases";
import { DownloadMode, EventType, LogModules, LogType, POIType} from "./enum";
//-----------------------------------------------------------------------------------------------
//MODULES
//-----------------------------------------------------------------------------------------------
import MDOM from "./MDOM";
import MapMenu from "./DOM/MapMenu";
import MenuRouteHistory from "./DOM/MenuRouteHistory";
//-----------------------------------------------------------------------------------------------
//CALLBACKS
//-----------------------------------------------------------------------------------------------
import { fire, on } from "./helpers/callbacks";

import generateMessage from "./DOM/Messages";
generateMessage(LogModules.main, LogType.success, "Init first", Date.now());

import { updateCategoryList } from "./DOM/CategoryList";

import {drawNewMode} from "./DOM/NetworkMode";

import GPSInfo from "./DOM/GPSInfo";

import { POIPropertiesWindow } from "./DOM/POIProperties";

import { setJobManagerState } from "./DOM/JobManager";
import ModalCachedMap from "./DOM/ModalCachedMap";

export default class Maptorium {

    private _jsonData = ServerData;                         //Get json data from server
    private _mapList:boolean | Array<MapList> = false;      //Maps list
    private _currentMap:string = "";                        //Current map
    private _layerList:boolean | Array<MapList> = false;    //Layers list
    private _currentLayers:Array<string> = [];              //Default layers list
    public DOM = MDOM;
    private _zoom:number = 0;

    public cachedMap = ModalCachedMap;
    
    private options = {
        gpsRouteRecord: false,
        vectorMapSupport: false,
        updateTime: 10000                               //How often ask server for updates             
    };

    constructor() {
        
        updateCategoryList();
    }

    async init() {
        //Get maps list
        await this._getMapsList();
        //Make routes list
        await MenuRouteHistory.make();
        //Get first map from the list
        //@ts-ignore
        this._currentMap = this._mapList[0].id;
        //Fire callback
        if(this._mapList && this._layerList) {
            MapMenu.makeMenu(this._mapList as MapList[]);
            MapMenu.makeMenu(this._layerList as MapList[], false);
            //Get default config
            await this._getDefConfig();
            //Fire that script finish all preparations
            fire(EventType.init, this._mapList, this._layerList);
            if(this._currentMap) {
                //Fire event to set map
                fire(EventType.mapChangeMap, this._currentMap);
                MapMenu.setState(this._currentMap, true);
            }
            //Fire event to set map layers for all maps layers
            for(let i = 0; i < this._currentLayers.length; i++) {
                fire(EventType.mapAddLayer, this._currentLayers[i]);
                MapMenu.setState(this._currentLayers[i], false);
            }
        }
        this._getPOIList();
        
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
                // if(mapInfo.format == MapFormat.vector && this.options.vectorMapSupport == false) {

                // }
                // else {
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
                //}
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
            if(defConfig.map && defConfig.lat && defConfig.lng && defConfig.zoom) {
                this._currentMap = defConfig.map;
                //Rise center map event
                fire(EventType.mapCenter, defConfig.lat, defConfig.lng, defConfig.zoom);
            }
            //Overide layesr by default in config
            if(defConfig.layers?.length > 0) this._currentLayers = defConfig.layers;
            //If need to show route
            //@ts-ignore
            if(typeof defConfig.showRoute == "string") defConfig.showRoute = (defConfig.showRoute === "true");
            //@ts-ignore
            if(typeof defConfig.recordRoute == "string") defConfig.recordRoute = (defConfig.recordRoute === "true");
            
            if(defConfig.showRoute) MenuRouteHistory.showRoute();

            if(defConfig.mode) drawNewMode(defConfig.mode);
            else drawNewMode(DownloadMode.enable);

            if(typeof defConfig.jobManager !== "undefined") setJobManagerState(defConfig.jobManager);

            if(typeof defConfig.GPSInfoPanel !== "undefined") GPSInfo.setInfoState(defConfig.GPSInfoPanel);

            if(defConfig.distanceToGo && defConfig.distanceToGo > 0) GPSInfo.setDistanceToGo(defConfig.distanceToGo);

            if(defConfig.recordRoute) {
                this.DOM.setButton("gpsRouteRecordButton");
            }
        }
    }

    public updateMapPosition(lat:number, lng:number, zoom:number):void {
        if(lat && lng && zoom) {
            this._jsonData.setDefConfig({lat, lng, zoom}, false);
        } 
    }

    public setZoom(zoom:number):void {
        if(zoom && zoom != this._zoom) {
            this._zoom = zoom;
        }
    }

    public on(event:EventType, callback:CallableFunction) {
        on(event, callback);
    } 
    //-------------------------------------------------------------------------------
    //Get POI list from server
    //-------------------------------------------------------------------------------
    private async _getPOIList() {
        let poiList = await this._jsonData.getPOIList();
        if(poiList?.length > 0) {
            for(let i = 0; i < poiList.length; i++) {
                let poiInfo = poiList[i];
                switch(poiInfo.type) {
                    case POIType.polygon:
                        fire(EventType.addPolygon, poiInfo.points, poiInfo.ID, {name: poiInfo.name, color: poiInfo.color, fillColor: poiInfo.fillColor, fillOpacity: poiInfo.fillOpacity, width: poiInfo.width});
                        break;
                    case POIType.polyline:
                        fire(EventType.addPolyline, poiInfo.points, poiInfo.ID, {name: poiInfo.name, color: poiInfo.color, width: poiInfo.width});
                        break;
                    case POIType.point:
                        fire(EventType.addPoint, {
                            lat: poiInfo.points[0].lat, 
                            lng: poiInfo.points[0].lng,
                            ID: poiInfo.ID, 
                            name: poiInfo.name
                        });
                        break;
                    default:
                        console.log("Unknown POI type: ", poiInfo.type);
                        break;
                }
            }
        }
    }
    //-------------------------------------------------------------------------------
    //POPUP Modal to edit POI properties
    //-------------------------------------------------------------------------------
    public async POIModal(ID:number, callback:CallableFunction = function() {}):Promise<void> {
        POIPropertiesWindow(ID, callback);
    }
    //-------------------------------------------------------------------------------
    //Start new route
    //-------------------------------------------------------------------------------
    public async startNewRoute(name:string):Promise<void> {
        await this._jsonData.startNewRoute(name); 
        await MenuRouteHistory.make();
    }
    //-------------------------------------------------------------------------------
    //Send POI info to server
    //-------------------------------------------------------------------------------
    public async addPOI(poiInfo:PoiInfo, drawOnMap:boolean = false):Promise<number> {
        let data = await this._jsonData.addPOI(poiInfo);
        if(drawOnMap && data.ID > 0) {
            switch(poiInfo.type) {
                case POIType.polygon:
                    fire(EventType.addPolygon, poiInfo.points, data.ID, {name: poiInfo.name, color: poiInfo.color, fillColor: poiInfo.fillColor, fillOpacity: poiInfo.fillOpacity, width: poiInfo.width});
                    break;
                case POIType.polyline:
                    fire(EventType.addPolyline, poiInfo.points, data.ID, {name: poiInfo.name, color: poiInfo.color, width: poiInfo.width});
                    break;
                case POIType.point:
                    fire(EventType.addPoint, {
                        lat: poiInfo.points[0].lat, 
                        lng: poiInfo.points[0].lng,
                        ID: data.ID, 
                        name: poiInfo.name
                    });
                    break;
                default:
                    console.log("Unknown POI type: ", poiInfo.type);
                    break;
            }
        }
        if(data.ID > 0) return data.ID;
        return 0;
    }
    //-------------------------------------------------------------------------------
    //Delete POI info from server
    //-------------------------------------------------------------------------------
    public async deletePOI(poiID:number):Promise<boolean> {
        return await this._jsonData.deletePOI(poiID);
    }
    //-------------------------------------------------------------------------------
    //Update POI on Server
    //-------------------------------------------------------------------------------
    public async updatePOI(poiID: number, type: string, points: Array<GPSCoords>):Promise<boolean> {
        return await this._jsonData.updatePOI(poiID, type, points);
    }
}
